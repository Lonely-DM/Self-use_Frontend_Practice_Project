"use client";

import { useState } from "react";
import styles from "./transaction-card.module.css";
import { formatCurrency, formatDate } from "@/lib/format";

export default function TransactionCard({
  transaction,
  delay = 0,
  t = (value) => value,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isIncome = transaction.type === "income";

  return (
    <article className={`${styles.card} ${menuOpen ? styles.menuOpenCard : ""}`} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.main}>
        <p className={styles.name}>{transaction.name}</p>
        <p className={`${styles.amount} ${isIncome ? styles.incomeAmount : styles.expenseAmount}`}>
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>

      <div className={styles.meta}>
        <span className={`${styles.type} ${isIncome ? styles.incomeType : styles.expenseType}`}>
          {t(isIncome ? "Income" : "Expenses")}
        </span>
        <span className={styles.date}>{formatDate(transaction.date)}</span>
      </div>

      <div className={styles.menuWrap}>
        <button type="button" className={styles.menuButton} onClick={() => setMenuOpen((current) => !current)}>
          {t("Actions")}
        </button>
        {menuOpen ? (
          <div className={styles.menu}>
            <button type="button" onClick={() => { setMenuOpen(false); onEdit(transaction); }}>
              {t("Edit")}
            </button>
            <button type="button" className={styles.deleteAction} onClick={() => { setMenuOpen(false); onDelete(transaction); }}>
              {t("Delete")}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
