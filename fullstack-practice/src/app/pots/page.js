"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { useSettings } from "@/components/settings-provider";
import FundsModal from "@/components/pots/funds-modal";
import PotCard from "@/components/pots/pot-card";
import PotModal from "@/components/pots/pot-modal";
import PotsSummary from "@/components/pots/pots-summary";
import styles from "@/styles/pots-page.module.css";

const emptySummary = {
  currentAvailable: 0,
  totalSaved: 0,
  totalTargets: 0,
  completionRate: 0,
  completedCount: 0,
  totalCount: 0,
};

function buildSummaryFromPots(pots, previousSummary = emptySummary) {
  const totalSaved = pots.reduce((sum, pot) => sum + Number(pot.saved || 0), 0);
  const totalTargets = pots.reduce((sum, pot) => sum + Number(pot.target || 0), 0);
  const completedCount = pots.filter((pot) => Number(pot.target || 0) > 0 && Number(pot.saved || 0) >= Number(pot.target || 0)).length;
  const totalBalance = Number(previousSummary.currentAvailable || 0) + Number(previousSummary.totalSaved || 0);

  return {
    currentAvailable: totalBalance - totalSaved,
    totalSaved,
    totalTargets,
    completionRate: pots.length ? (completedCount / pots.length) * 100 : 0,
    completedCount,
    totalCount: pots.length,
  };
}

export default function PotsPage() {
  const { t } = useSettings();
  const [potsData, setPotsData] = useState({ pots: [], summary: emptySummary });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fundsError, setFundsError] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "new", pot: null });
  const [fundsState, setFundsState] = useState({ open: false, mode: "add", pot: null });
  const [deletePotState, setDeletePotState] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadPots() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/pots", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load pots.");
      }

      setPotsData(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load pots.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPots();
  }, []);

  const headerButton = useMemo(
    () => (
      <button className={styles.newButton} type="button" onClick={() => setModalState({ open: true, mode: "new", pot: null })}>
        + {t("New Pot")}
      </button>
    ),
    [t],
  );

  async function handlePotSubmit(form) {
    setSubmitting(true);

    try {
      const isEdit = modalState.mode === "edit" && modalState.pot;
      const response = await fetch(isEdit ? `/api/pots/${modalState.pot.id}` : "/api/pots", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          target: Number(form.target),
          saved: Number(form.saved || 0),
          color: form.color,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save pot.");
      }

      setModalState({ open: false, mode: "new", pot: null });
      await loadPots();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save pot.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFundsSubmit(amount) {
    if (!fundsState.pot) {
      return;
    }

    setSubmitting(true);
    setFundsError("");

    try {
      const response = await fetch(`/api/pots/${fundsState.pot.id}/${fundsState.mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update funds.");
      }

      setFundsState({ open: false, mode: "add", pot: null });
      setFundsError("");
      await loadPots();
    } catch (submitError) {
      setFundsError(submitError instanceof Error ? submitError.message : "Unable to update funds.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletePotState) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/pots/${deletePotState.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete pot.");
      }

      setPotsData((current) => {
        const nextPots = current.pots.filter((pot) => pot.id !== deletePotState.id);

        return {
          pots: nextPots,
          summary: buildSummaryFromPots(nextPots, current.summary),
        };
      });
      setDeletePotState(null);
      void loadPots();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to delete pot.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell
      title="Pots"
      eyebrow="Section"
      description="Track your savings goals and progress"
      headerContent={headerButton}
    >
      <div className={styles.pageIntro}>
        {error ? <div className={styles.errorBanner}>{t(error)}</div> : null}

        {loading ? (
          <div className={styles.stateCard}>{t("Loading pots...")}</div>
        ) : (
          <>
            <PotsSummary summary={potsData.summary} delay={0.05} t={t} />

            {potsData.pots.length ? (
              <section className={styles.grid}>
                {potsData.pots.map((pot, index) => (
                  <PotCard
                    key={pot.id}
                    pot={pot}
                    delay={0.08 * index}
                    t={t}
                    onEdit={(nextPot) => setModalState({ open: true, mode: "edit", pot: nextPot })}
                    onDelete={(nextPot) => setDeletePotState(nextPot)}
                    onAddFunds={(nextPot) => {
                      setFundsError("");
                      setFundsState({ open: true, mode: "add", pot: nextPot });
                    }}
                    onWithdraw={(nextPot) => {
                      setFundsError("");
                      setFundsState({ open: true, mode: "withdraw", pot: nextPot });
                    }}
                  />
                ))}
              </section>
            ) : (
              <section className={styles.emptyState}>
                <h2>{t("No saving pots yet.")}</h2>
                <p>{t("Start your first goal today.")}</p>
                <button
                  className={styles.newButton}
                  type="button"
                  onClick={() => setModalState({ open: true, mode: "new", pot: null })}
                >
                  + {t("New Pot")}
                </button>
              </section>
            )}
          </>
        )}
      </div>

      <PotModal
        open={modalState.open}
        mode={modalState.mode}
        pot={modalState.pot}
        onClose={() => setModalState({ open: false, mode: "new", pot: null })}
        onSubmit={handlePotSubmit}
        submitting={submitting}
        t={t}
      />

      <FundsModal
        open={fundsState.open}
        mode={fundsState.mode}
        pot={fundsState.pot}
        onClose={() => {
          setFundsState({ open: false, mode: "add", pot: null });
          setFundsError("");
        }}
        onSubmit={handleFundsSubmit}
        submitting={submitting}
        error={fundsError}
        availableBalance={potsData.summary.currentAvailable}
        t={t}
      />

      {deletePotState ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => setDeletePotState(null)}>
          <section className={styles.confirmModal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <p className={styles.confirmEyebrow}>{t("Delete")}</p>
            <h3 className={styles.confirmTitle}>{deletePotState.name}</h3>
            <p className={styles.confirmText}>{t("This action cannot be undone.")}</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setDeletePotState(null)}>
                {t("Cancel")}
              </button>
              <button type="button" className={styles.dangerButton} disabled={submitting} onClick={handleDelete}>
                {submitting ? t("Deleting...") : t("Delete")}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </DashboardShell>
  );
}
