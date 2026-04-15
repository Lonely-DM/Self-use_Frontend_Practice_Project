"use client";

import styles from "@/styles/summary-cards.module.css";
import { formatCurrency } from "@/lib/format";
import { useSettings } from "@/components/settings-provider";

const cards = [
  { key: "balance", label: "Current Balance" },
  { key: "income", label: "Income" },
  { key: "expenses", label: "Expenses" },
];

export default function SummaryCards({ balance, income, expenses, delay = 0 }) {
  const values = { balance, income, expenses };
  const { t } = useSettings();

  return (
    <section className={styles.grid}>
      {cards.map((card, index) => (
        <article
          key={card.key}
          className={styles.card}
          style={{ animationDelay: `${delay + index * 0.1}s` }}
        >
          <p className={styles.label}>{t(card.label)}</p>
          <p className={styles.value}>{formatCurrency(values[card.key])}</p>
        </article>
      ))}
    </section>
  );
}
