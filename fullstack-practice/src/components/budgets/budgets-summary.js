"use client";

import styles from "./budgets-summary.module.css";
import { formatCurrency } from "@/lib/format";

export default function BudgetsSummary({ summary, delay = 0, t = (value) => value }) {
  const cards = [
    { label: "Total Budgeted", value: formatCurrency(summary.totalBudgeted) },
    { label: "Total Spent", value: formatCurrency(summary.totalSpent) },
    { label: "Remaining Budget", value: formatCurrency(summary.totalRemaining) },
  ];

  return (
    <section className={styles.grid}>
      {cards.map((card, index) => (
        <article
          key={card.label}
          className={styles.card}
          style={{ animationDelay: `${delay + index * 0.08}s` }}
        >
          <p className={styles.label}>{t(card.label)}</p>
          <p className={styles.value}>{card.value}</p>
        </article>
      ))}
    </section>
  );
}
