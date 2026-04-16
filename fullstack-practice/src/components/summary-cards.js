"use client";

import { useSettings } from "@/components/settings-provider";
import { formatCurrency } from "@/lib/format";
import styles from "@/styles/summary-cards.module.css";

export default function SummaryCards({
  availableBalance,
  income,
  expenses,
  potsSaved,
  delay = 0,
}) {
  const { t } = useSettings();
  const currentBalance = availableBalance + potsSaved;

  return (
    <section className={styles.grid}>
      <article className={`${styles.card} ${styles.balanceCard}`} style={{ animationDelay: `${delay}s` }}>
        <div className={styles.balanceMain}>
          <p className={styles.label}>{t("Current Balance")}</p>
          <p className={styles.value}>{formatCurrency(currentBalance)}</p>
        </div>

        <div className={styles.balanceBreakdown}>
          <div className={styles.metricStack}>
            <span className={styles.metricLabel}>{t("Free Funds")}</span>
            <span className={styles.metricValue}>{formatCurrency(availableBalance)}</span>
          </div>
          <div className={styles.metricStack}>
            <span className={styles.metricLabel}>{t("In Pots")}</span>
            <span className={styles.metricValue}>{formatCurrency(potsSaved)}</span>
          </div>
        </div>
      </article>

      <article className={`${styles.card} ${styles.compactCard}`} style={{ animationDelay: `${delay + 0.1}s` }}>
        <p className={styles.label}>{t("Income")}</p>
        <p className={styles.value}>{formatCurrency(income)}</p>
      </article>

      <article className={`${styles.card} ${styles.compactCard}`} style={{ animationDelay: `${delay + 0.2}s` }}>
        <p className={styles.label}>{t("Expenses")}</p>
        <p className={styles.value}>{formatCurrency(expenses)}</p>
      </article>
    </section>
  );
}
