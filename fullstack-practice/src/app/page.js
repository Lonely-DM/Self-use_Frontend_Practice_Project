"use client";

import { useEffect, useState } from "react";
import BudgetChart from "@/components/budget-chart";
import DashboardShell from "@/components/dashboard-shell";
import PotsCard from "@/components/pots-card";
import RecurringBills from "@/components/recurring-bills";
import SummaryCards from "@/components/summary-cards";
import TransactionsList from "@/components/transactions-list";
import { useSettings } from "@/components/settings-provider";
import styles from "@/styles/overview-page.module.css";

export default function Home() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useSettings();

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/overview", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load finance overview.");
        }

        if (!cancelled) {
          setOverview(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Failed to load finance overview.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardShell title="Personal Finance Dashboard" eyebrow="Overview">
      {loading ? (
        <div className={styles.messageCard}>{t("Loading finance overview...")}</div>
      ) : error ? (
        <div className={`${styles.messageCard} ${styles.errorCard}`}>{t(error)}</div>
      ) : (
        <>
          <SummaryCards
            availableBalance={overview.availableBalance}
            income={overview.income}
            expenses={overview.expenses}
            potsSaved={overview.potsSaved}
            delay={0.1}
          />

          <div className={styles.primaryGrid}>
            <TransactionsList transactions={overview.transactions} delay={0.2} />
            <BudgetChart budgets={overview.budgets} delay={0.3} />
          </div>

          <div className={styles.secondaryGrid}>
            <PotsCard pots={overview.pots} delay={0.4} />
            <RecurringBills recurringBills={overview.recurringBills} delay={0.5} />
          </div>
        </>
      )}
    </DashboardShell>
  );
}
