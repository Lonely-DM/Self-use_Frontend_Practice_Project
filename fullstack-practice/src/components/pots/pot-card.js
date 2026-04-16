"use client";

import { useMemo, useState } from "react";
import styles from "./pot-card.module.css";
import { formatCurrency, formatDate } from "@/lib/format";

export default function PotCard({
  pot,
  delay = 0,
  t = (value) => value,
  onEdit,
  onDelete,
  onAddFunds,
  onWithdraw,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useMemo(
    () => (pot.target ? Math.min((pot.saved / pot.target) * 100, 100) : 0),
    [pot.saved, pot.target],
  );
  const remaining = Math.max(pot.target - pot.saved, 0);
  const isCompleted = progress >= 100;
  const almostThere = progress >= 90 && progress < 100;

  return (
    <article
      className={`${styles.card} ${isCompleted ? styles.completed : ""}`}
      style={{ animationDelay: `${delay}s`, "--progress-width": `${progress}%`, "--pot-color": pot.color }}
    >
      <div className={styles.header}>
        <div>
          <p className={styles.name}>{pot.name}</p>
          <p className={styles.saved}>{formatCurrency(pot.saved)}</p>
        </div>

        <div className={styles.menuWrap}>
          <button type="button" className={styles.menuButton} onClick={() => setMenuOpen((current) => !current)}>
            {t("Actions")}
          </button>
          {menuOpen ? (
            <div className={styles.menu}>
              <button type="button" onClick={() => { setMenuOpen(false); onEdit(pot); }}>
                {t("Edit")}
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); onAddFunds(pot); }}>
                {t("Add Funds")}
              </button>
              <button type="button" onClick={() => { setMenuOpen(false); onWithdraw(pot); }}>
                {t("Withdraw")}
              </button>
              <button type="button" className={styles.deleteAction} onClick={() => { setMenuOpen(false); onDelete(pot); }}>
                {t("Delete")}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.meta}>
        <span>{t("Target")} {formatCurrency(pot.target)}</span>
        <span>{progress.toFixed(0)}%</span>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} />
      </div>

      <div className={styles.footer}>
        <p className={styles.remaining}>{t("Remaining")} {formatCurrency(remaining)}</p>
        <p className={styles.updated}>{t("Updated")} {formatDate(pot.updated_at)}</p>
      </div>

      {almostThere ? <p className={styles.badge}>{t("Almost there 🎯")}</p> : null}
      {isCompleted ? <p className={`${styles.badge} ${styles.completedBadge}`}>{t("Completed")}</p> : null}
    </article>
  );
}
