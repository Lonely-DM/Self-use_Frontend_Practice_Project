"use client";

import styles from "./pots-summary.module.css";
import { formatCurrency } from "@/lib/format";

export default function PotsSummary({ summary, delay = 0, t = (value) => value }) {
  const cards = [
    { label: "Current Available", value: formatCurrency(summary.currentAvailable) },
    { label: "Total Saved", value: formatCurrency(summary.totalSaved) },
    { label: "Total Targets", value: formatCurrency(summary.totalTargets) },
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
