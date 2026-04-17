"use client";

import { useMemo, useState } from "react";
import styles from "./budget-card.module.css";
import { formatCurrency, formatDate } from "@/lib/format";

export default function BudgetCard({
  budget,
  delay = 0,
  t = (value) => value,
  onEdit,
  onDelete,
  onAddSpend,
  onRefund,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useMemo(
    () => (budget.amount ? Math.min((budget.spent / budget.amount) * 100, 100) : 0),
    [budget.amount, budget.spent],
  );
  const remaining = budget.amount - budget.spent;
  const isOverspent = remaining < 0;
  const almostSpent = progress >= 90 && progress < 100;

  return (
    <article
      className={`${styles.card} ${isOverspent ? styles.overspent : ""} ${menuOpen ? styles.menuOpenCard : ""}`}
      style={{ animationDelay: `${delay}s`, "--progress-width": `${progress}%`, "--budget-color": budget.color }}
    >
      <div className={styles.header}>
        <div>
          <p className={styles.name}>{budget.category}</p>
          <p className={styles.amount}>{formatCurrency(budget.amount)}</p>
        </div>

        <div className={styles.menuWrap}>
          <button type="button" className={styles.menuButton} onClick={() => setMenuOpen((current) => !current)}>
            {t("Actions")}
          </button>
          {menuOpen ? (
            <div className={styles.menu}>
              <button type="button" onClick={() => { setMenuOpen(false); onEdit(budget); }}>
                {t("Edit")}
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); onAddSpend(budget); }}>
                {t("Add Spend")}
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); onRefund(budget); }}>
                {t("Reduce Spend")}
              </button>
              <button type="button" className={styles.deleteAction} onClick={() => { setMenuOpen(false); onDelete(budget); }}>
                {t("Delete")}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.meta}>
        <span>{t("Spent")} {formatCurrency(budget.spent)}</span>
        <span>{Math.min(progress, 999).toFixed(0)}%</span>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} />
      </div>

      <div className={styles.footer}>
        <p className={`${styles.remaining} ${isOverspent ? styles.overValue : ""}`}>
          {isOverspent ? t("Over Budget") : t("Remaining")} {formatCurrency(Math.abs(remaining))}
        </p>
        <p className={styles.updated}>{t("Updated")} {formatDate(budget.updated_at)}</p>
      </div>

      {almostSpent ? <p className={styles.badge}>{t("Almost spent")}</p> : null}
      {isOverspent ? <p className={`${styles.badge} ${styles.overspentBadge}`}>{t("Over Budget")}</p> : null}
    </article>
  );
}
