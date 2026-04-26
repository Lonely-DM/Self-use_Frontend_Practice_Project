"use client";

import { useEffect, useMemo, useState } from "react";
import BudgetCard from "@/components/budgets/budget-card";
import BudgetModal from "@/components/budgets/budget-modal";
import BudgetsSummary from "@/components/budgets/budgets-summary";
import SpendModal from "@/components/budgets/spend-modal";
import DashboardShell from "@/components/dashboard-shell";
import { useSettings } from "@/components/settings-provider";
import styles from "@/styles/budgets-page.module.css";

const emptySummary = {
  totalBudgeted: 0,
  totalSpent: 0,
  totalRemaining: 0,
  overspentCount: 0,
  totalCount: 0,
};

function buildSummaryFromBudgets(budgets) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + Number(budget.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + Number(budget.spent || 0), 0);
  const totalRemaining = budgets.reduce(
    (sum, budget) => sum + Math.max(Number(budget.amount || 0) - Number(budget.spent || 0), 0),
    0,
  );
  const overspentCount = budgets.filter((budget) => Number(budget.spent || 0) > Number(budget.amount || 0)).length;

  return {
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overspentCount,
    totalCount: budgets.length,
  };
}

export default function BudgetsPage() {
  const { t } = useSettings();
  const [budgetsData, setBudgetsData] = useState({ budgets: [], summary: emptySummary });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [spendError, setSpendError] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "new", budget: null });
  const [spendState, setSpendState] = useState({ open: false, mode: "spend", budget: null });
  const [deleteBudgetState, setDeleteBudgetState] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadBudgets() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/budgets", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load budgets.");
      }

      setBudgetsData(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  const headerButton = useMemo(
    () => (
      <button className={styles.newButton} type="button" onClick={() => setModalState({ open: true, mode: "new", budget: null })}>
        + {t("New Budget")}
      </button>
    ),
    [t],
  );

  const filteredBudgets = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return budgetsData.budgets;
    }

    return budgetsData.budgets.filter((budget) => budget.category.toLowerCase().includes(keyword));
  }, [budgetsData.budgets, query]);

  async function handleBudgetSubmit(form) {
    setSubmitting(true);

    try {
      const isEdit = modalState.mode === "edit" && modalState.budget;
      const response = await fetch(isEdit ? `/api/budgets/${modalState.budget.id}` : "/api/budgets", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          amount: Number(form.amount),
          spent: Number(form.spent || 0),
          color: form.color,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save budget.");
      }

      setModalState({ open: false, mode: "new", budget: null });
      await loadBudgets();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save budget.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSpendSubmit(amount) {
    if (!spendState.budget) {
      return;
    }

    setSubmitting(true);
    setSpendError("");

    try {
      const response = await fetch(`/api/budgets/${spendState.budget.id}/${spendState.mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update budget spend.");
      }

      setSpendState({ open: false, mode: "spend", budget: null });
      setSpendError("");
      await loadBudgets();
    } catch (submitError) {
      setSpendError(submitError instanceof Error ? submitError.message : "Unable to update budget spend.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteBudgetState) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/budgets/${deleteBudgetState.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete budget.");
      }

      setBudgetsData((current) => {
        const nextBudgets = current.budgets.filter((budget) => budget.id !== deleteBudgetState.id);
        return {
          budgets: nextBudgets,
          summary: buildSummaryFromBudgets(nextBudgets),
        };
      });
      setDeleteBudgetState(null);
      void loadBudgets();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to delete budget.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell
      title="Budgets"
      eyebrow="Section"
      description="Plan your spending and track category performance"
      headerContent={headerButton}
    >
      <div className={styles.pageIntro}>
        {error ? <div className={styles.errorBanner}>{t(error)}</div> : null}

        {loading ? (
          <div className={styles.stateCard}>{t("Loading budgets...")}</div>
        ) : (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder={t("Search budgets")}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <BudgetsSummary summary={budgetsData.summary} delay={0.05} t={t} />

            {filteredBudgets.length ? (
              <section className={styles.grid}>
                {filteredBudgets.map((budget, index) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    delay={0.08 * index}
                    t={t}
                    onEdit={(nextBudget) => setModalState({ open: true, mode: "edit", budget: nextBudget })}
                    onDelete={(nextBudget) => setDeleteBudgetState(nextBudget)}
                    onAddSpend={(nextBudget) => {
                      setSpendError("");
                      setSpendState({ open: true, mode: "spend", budget: nextBudget });
                    }}
                    onRefund={(nextBudget) => {
                      setSpendError("");
                      setSpendState({ open: true, mode: "refund", budget: nextBudget });
                    }}
                  />
                ))}
              </section>
            ) : (
              <section className={styles.emptyState}>
                <h2>{query ? t("No matching budgets.") : t("No budgets yet.")}</h2>
                <p>{query ? t("Try a different keyword.") : t("Start your first spending plan today.")}</p>
                {!query ? (
                  <button className={styles.newButton} type="button" onClick={() => setModalState({ open: true, mode: "new", budget: null })}>
                    + {t("New Budget")}
                  </button>
                ) : null}
              </section>
            )}
          </>
        )}
      </div>

      <BudgetModal
        open={modalState.open}
        mode={modalState.mode}
        budget={modalState.budget}
        onClose={() => setModalState({ open: false, mode: "new", budget: null })}
        onSubmit={handleBudgetSubmit}
        submitting={submitting}
        t={t}
      />

      <SpendModal
        open={spendState.open}
        mode={spendState.mode}
        budget={spendState.budget}
        onClose={() => {
          setSpendState({ open: false, mode: "spend", budget: null });
          setSpendError("");
        }}
        onSubmit={handleSpendSubmit}
        submitting={submitting}
        error={spendError}
        t={t}
      />

      {deleteBudgetState ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => setDeleteBudgetState(null)}>
          <section className={styles.confirmModal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <p className={styles.confirmEyebrow}>{t("Delete")}</p>
            <h3 className={styles.confirmTitle}>{deleteBudgetState.category}</h3>
            <p className={styles.confirmText}>{t("This action cannot be undone.")}</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setDeleteBudgetState(null)}>
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
