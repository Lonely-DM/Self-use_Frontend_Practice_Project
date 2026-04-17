"use client";

import { useEffect, useState } from "react";
import styles from "./budget-modal.module.css";

const defaultForm = {
  category: "",
  amount: "",
  spent: "0",
  color: "#277C78",
};

export default function BudgetModal({ open, mode, budget, onClose, onSubmit, submitting, t = (value) => value }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && budget) {
      setForm({
        category: budget.category,
        amount: String(budget.amount),
        spent: String(budget.spent),
        color: budget.color || "#277C78",
      });
      return;
    }

    setForm(defaultForm);
  }, [budget, mode, open]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section className={styles.modal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{mode === "edit" ? t("Edit Budget") : t("New Budget")}</p>
            <h3 className={styles.title}>{mode === "edit" ? budget?.category : t("Create a new budget")}</h3>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
          <label className={styles.field}>
            <span>{t("Category")}</span>
            <input
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              placeholder="Travel"
            />
          </label>

          <label className={styles.field}>
            <span>{t("Budget Amount")}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            />
          </label>

          {mode === "new" ? (
            <label className={styles.field}>
              <span>{t("Spent")}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.spent}
                onChange={(event) => setForm((current) => ({ ...current, spent: event.target.value }))}
              />
            </label>
          ) : null}

          <label className={styles.field}>
            <span>{t("Color")}</span>
            <div className={styles.colorField}>
              <input
                className={styles.colorInput}
                type="color"
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
              />
              <div className={styles.colorMeta}>
                <span className={styles.colorValue}>{form.color.toUpperCase()}</span>
                <span className={styles.colorHint}>{t("Pick a budget accent color")}</span>
              </div>
            </div>
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>{t("Cancel")}</button>
            <button type="submit" className={styles.primaryButton} disabled={submitting}>
              {submitting ? t("Saving...") : mode === "edit" ? t("Save Changes") : t("Create Budget")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
