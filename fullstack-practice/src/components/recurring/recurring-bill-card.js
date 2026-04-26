"use client";

import { useState } from "react";
import styles from "./recurring-bill-card.module.css";
import { formatCurrency, formatDate } from "@/lib/format";

const statusLabels = {
  paid: "Paid",
  upcoming: "Upcoming",
  due: "Due Soon",
};

export default function RecurringBillCard({ bill, delay = 0, t = (value) => value, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className={`${styles.card} ${menuOpen ? styles.menuOpenCard : ""}`} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.name}>{bill.name}</p>
          <p className={styles.amount}>{formatCurrency(bill.amount)}</p>
        </div>

        <div className={styles.menuWrap}>
          <button type="button" className={styles.menuButton} onClick={() => setMenuOpen((current) => !current)}>
            {t("Actions")}
          </button>
          {menuOpen ? (
            <div className={styles.menu}>
              <button type="button" onClick={() => { setMenuOpen(false); onEdit(bill); }}>
                {t("Edit")}
              </button>
              <button type="button" className={styles.deleteAction} onClick={() => { setMenuOpen(false); onDelete(bill); }}>
                {t("Delete")}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={`${styles.status} ${styles[bill.status]}`}>{t(statusLabels[bill.status] || bill.status)}</span>
        <span className={styles.updated}>{t("Updated")} {formatDate(bill.updated_at)}</span>
      </div>
    </article>
  );
}
