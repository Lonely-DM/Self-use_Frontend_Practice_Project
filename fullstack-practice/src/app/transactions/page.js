"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { useSettings } from "@/components/settings-provider";
import TransactionCard from "@/components/transactions/transaction-card";
import TransactionModal from "@/components/transactions/transaction-modal";
import TransactionsSummary from "@/components/transactions/transactions-summary";
import styles from "@/styles/transactions-page.module.css";

const emptySummary = {
  totalTransactions: 0,
  totalIncome: 0,
  totalExpenses: 0,
  netChange: 0,
};

function buildSummary(transactions) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  return {
    totalTransactions: transactions.length,
    totalIncome,
    totalExpenses,
    netChange: totalIncome - totalExpenses,
  };
}

export default function TransactionsPage() {
  const { t } = useSettings();
  const [data, setData] = useState({ transactions: [], summary: emptySummary });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "new", transaction: null });
  const [deleteTransactionState, setDeleteTransactionState] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadTransactions() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/transactions", { cache: "no-store" });
      const nextData = await response.json();

      if (!response.ok) {
        throw new Error(nextData.error || "Failed to load transactions.");
      }

      setData(nextData);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return data.transactions;
    }

    return data.transactions.filter((transaction) => {
      const source = `${transaction.name} ${transaction.type} ${transaction.date}`.toLowerCase();
      return source.includes(keyword);
    });
  }, [data.transactions, query]);

  async function handleSubmit(form) {
    setSubmitting(true);

    try {
      const isEdit = modalState.mode === "edit" && modalState.transaction;
      const response = await fetch(isEdit ? `/api/transactions/${modalState.transaction.id}` : "/api/transactions", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
          date: form.date,
          type: form.type,
        }),
      });
      const nextData = await response.json();

      if (!response.ok) {
        throw new Error(nextData.error || "Unable to save transaction.");
      }

      setModalState({ open: false, mode: "new", transaction: null });
      await loadTransactions();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save transaction.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTransactionState) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/transactions/${deleteTransactionState.id}`, { method: "DELETE" });
      const nextData = await response.json();

      if (!response.ok) {
        throw new Error(nextData.error || "Unable to delete transaction.");
      }

      setData((current) => {
        const transactions = current.transactions.filter((transaction) => transaction.id !== deleteTransactionState.id);
        return {
          transactions,
          summary: buildSummary(transactions),
        };
      });
      setDeleteTransactionState(null);
      void loadTransactions();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to delete transaction.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell
      title="Transactions"
      eyebrow="Section"
      description="Track every income and expense across your account activity"
      headerContent={
        <button className={styles.newButton} type="button" onClick={() => setModalState({ open: true, mode: "new", transaction: null })}>
          + {t("New Transaction")}
        </button>
      }
    >
      <div className={styles.pageIntro}>
        {error ? <div className={styles.errorBanner}>{t(error)}</div> : null}

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder={t("Search transactions")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.stateCard}>{t("Loading transactions...")}</div>
        ) : (
          <>
            <TransactionsSummary summary={data.summary} delay={0.05} t={t} />

            {filteredTransactions.length ? (
              <section className={styles.listPanel}>
                <div className={styles.listHead}>
                  <p className={styles.listTitle}>{t("Transactions")}</p>
                  <p className={styles.listMeta}>{filteredTransactions.length}</p>
                </div>
                <div className={styles.listScroll}>
                  <div className={styles.list}>
                {filteredTransactions.map((transaction, index) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    delay={0.08 * index}
                    t={t}
                    onEdit={(nextTransaction) => setModalState({ open: true, mode: "edit", transaction: nextTransaction })}
                    onDelete={(nextTransaction) => setDeleteTransactionState(nextTransaction)}
                  />
                ))}
                  </div>
                </div>
              </section>
            ) : (
              <section className={styles.emptyState}>
                <h2>{query ? t("No matching transactions.") : t("No transactions yet.")}</h2>
                <p>{query ? t("Try a different keyword.") : t("Add your first income or expense today.")}</p>
                {!query ? (
                  <button className={styles.newButton} type="button" onClick={() => setModalState({ open: true, mode: "new", transaction: null })}>
                    + {t("New Transaction")}
                  </button>
                ) : null}
              </section>
            )}
          </>
        )}
      </div>

      <TransactionModal
        open={modalState.open}
        mode={modalState.mode}
        transaction={modalState.transaction}
        onClose={() => setModalState({ open: false, mode: "new", transaction: null })}
        onSubmit={handleSubmit}
        submitting={submitting}
        t={t}
      />

      {deleteTransactionState ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => setDeleteTransactionState(null)}>
          <section className={styles.confirmModal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <p className={styles.confirmEyebrow}>{t("Delete")}</p>
            <h3 className={styles.confirmTitle}>{deleteTransactionState.name}</h3>
            <p className={styles.confirmText}>{t("This action cannot be undone.")}</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setDeleteTransactionState(null)}>
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
