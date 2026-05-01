"use client";

import styles from "./transactions-summary.module.css";
import { formatCurrency } from "@/lib/format";

export default function TransactionsSummary({ summary, delay = 0, t = (value) => value }) {
  const cards = [
    { label: "Total Transactions", value: String(summary.totalTransactions || 0) },
    { label: "Income", value: formatCurrency(summary.totalIncome || 0) },
    { label: "Expenses", value: formatCurrency(summary.totalExpenses || 0) },
  ];

  return (
    <section className={styles.grid}>
      {cards.map((card, index) => (
        <article key={card.label} className={styles.card} style={{ animationDelay: `${delay + index * 0.08}s` }}>
          <p className={styles.label}>{t(card.label)}</p>
          <p className={styles.value}>{card.value}</p>
        </article>
      ))}
    </section>
  );
}
