"use client";

import styles from "./recurring-summary.module.css";
import { formatCurrency } from "@/lib/format";

export default function RecurringSummary({ summary, delay = 0, t = (value) => value }) {
  const cards = [
    { label: "Total Bills", value: String(summary.totalBills || 0) },
    { label: "Monthly Total", value: formatCurrency(summary.monthlyTotal || 0) },
    { label: "Due Soon", value: String(summary.dueCount || 0) },
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
