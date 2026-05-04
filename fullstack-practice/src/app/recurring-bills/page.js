"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import RecurringBillCard from "@/components/recurring/recurring-bill-card";
import RecurringBillModal from "@/components/recurring/recurring-bill-modal";
import RecurringSummary from "@/components/recurring/recurring-summary";
import { useSettings } from "@/components/settings-provider";
import styles from "@/styles/recurring-bills-page.module.css";

const emptySummary = {
  totalBills: 0,
  monthlyTotal: 0,
  paidCount: 0,
  dueCount: 0,
};

function buildSummary(recurringBills) {
  return {
    totalBills: recurringBills.length,
    monthlyTotal: recurringBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0),
    paidCount: recurringBills.filter((bill) => bill.status === "paid").length,
    dueCount: recurringBills.filter((bill) => bill.status === "due").length,
  };
}

export default function RecurringBillsPage() {
  const { t } = useSettings();
  const [data, setData] = useState({ recurringBills: [], summary: emptySummary });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "new", bill: null });
  const [deleteBillState, setDeleteBillState] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadBills() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/recurring-bills", { cache: "no-store" });
      const nextData = await response.json();

      if (!response.ok) {
        throw new Error(nextData.error || "Failed to load recurring bills.");
      }

      setData(nextData);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load recurring bills.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBills();
  }, []);

  const filteredBills = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return data.recurringBills;
    }

    return data.recurringBills.filter((bill) => {
      const source = `${bill.name} ${bill.status}`.toLowerCase();
      return source.includes(keyword);
    });
  }, [data.recurringBills, query]);

  async function handleSubmit(form) {
    setSubmitting(true);

    try {
      const isEdit = modalState.mode === "edit" && modalState.bill;
      const response = await fetch(isEdit ? `/api/recurring-bills/${modalState.bill.id}` : "/api/recurring-bills", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
          status: form.status,
        }),
      });
      const nextData = await response.json();

      if (!response.ok) {
        throw new Error(nextData.error || "Unable to save recurring bill.");
      }

      setModalState({ open: false, mode: "new", bill: null });
      await loadBills();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save recurring bill.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteBillState) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/recurring-bills/${deleteBillState.id}`, { method: "DELETE" });
      const nextData = await response.json();

      if (!response.ok) {
        throw new Error(nextData.error || "Unable to delete recurring bill.");
      }

      setData((current) => {
        const recurringBills = current.recurringBills.filter((bill) => bill.id !== deleteBillState.id);
        return {
          recurringBills,
          summary: buildSummary(recurringBills),
        };
      });
      setDeleteBillState(null);
      void loadBills();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to delete recurring bill.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell
      title="Recurring Bills"
      eyebrow="Section"
      description="Manage your repeating payments and keep due bills in view"
      headerContent={
        <button className={styles.newButton} type="button" onClick={() => setModalState({ open: true, mode: "new", bill: null })}>
          + {t("New Bill")}
        </button>
      }
    >
      <div className={styles.pageIntro}>
        {error ? <div className={styles.errorBanner}>{t(error)}</div> : null}

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} size={18} strokeWidth={2.1} aria-hidden="true" />
            <input
              className={styles.searchInput}
              type="search"
              placeholder={t("Search recurring bills")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.stateCard}>{t("Loading recurring bills...")}</div>
        ) : (
          <>
            <RecurringSummary summary={data.summary} delay={0.05} t={t} />

            {filteredBills.length ? (
              <section className={styles.grid}>
                {filteredBills.map((bill, index) => (
                  <RecurringBillCard
                    key={bill.id}
                    bill={bill}
                    delay={0.08 * index}
                    t={t}
                    onEdit={(nextBill) => setModalState({ open: true, mode: "edit", bill: nextBill })}
                    onDelete={(nextBill) => setDeleteBillState(nextBill)}
                  />
                ))}
              </section>
            ) : (
              <section className={styles.emptyState}>
                <h2>{query ? t("No matching recurring bills.") : t("No recurring bills yet.")}</h2>
                <p>{query ? t("Try a different keyword.") : t("Create your first recurring bill today.")}</p>
                {!query ? (
                  <button className={styles.newButton} type="button" onClick={() => setModalState({ open: true, mode: "new", bill: null })}>
                    + {t("New Bill")}
                  </button>
                ) : null}
              </section>
            )}
          </>
        )}
      </div>

      <RecurringBillModal
        open={modalState.open}
        mode={modalState.mode}
        bill={modalState.bill}
        onClose={() => setModalState({ open: false, mode: "new", bill: null })}
        onSubmit={handleSubmit}
        submitting={submitting}
        t={t}
      />

      {deleteBillState ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => setDeleteBillState(null)}>
          <section className={styles.confirmModal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <p className={styles.confirmEyebrow}>{t("Delete")}</p>
            <h3 className={styles.confirmTitle}>{deleteBillState.name}</h3>
            <p className={styles.confirmText}>{t("This action cannot be undone.")}</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setDeleteBillState(null)}>
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
