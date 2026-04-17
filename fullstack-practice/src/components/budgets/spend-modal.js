"use client";

import { useEffect, useState } from "react";
import styles from "./spend-modal.module.css";
import { formatCurrency } from "@/lib/format";

export default function SpendModal({
  open,
  mode,
  budget,
  onClose,
  onSubmit,
  submitting,
  error = "",
  t = (value) => value,
}) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (open) {
      setAmount("");
    }
  }, [open]);

  if (!open || !budget) {
    return null;
  }

  const title = mode === "spend" ? t("Add Spend") : t("Reduce Spend");
  const remaining = budget.amount - budget.spent;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section className={styles.modal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{title}</p>
            <h3 className={styles.title}>{budget.category}</h3>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.body}>
          <p className={styles.helpText}>{t("Current spent")}: {formatCurrency(budget.spent)}</p>
          <p className={styles.helpText}>{t("Remaining Budget")}: {formatCurrency(Math.max(remaining, 0))}</p>

          <label className={styles.field}>
            <span>{t("Amount")}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>

          {error ? <p className={styles.errorText}>{t(error)}</p> : null}

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>{t("Cancel")}</button>
            <button type="button" className={styles.primaryButton} disabled={submitting} onClick={() => onSubmit(amount)}>
              {submitting ? t("Saving...") : title}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
