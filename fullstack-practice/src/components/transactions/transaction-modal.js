"use client";

import { useEffect, useState } from "react";
import styles from "./transaction-modal.module.css";

const defaultForm = {
  name: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  type: "expense",
};

export default function TransactionModal({ open, mode, transaction, onClose, onSubmit, submitting, t = (value) => value }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && transaction) {
      setForm({
        name: transaction.name,
        amount: String(transaction.amount),
        date: transaction.date,
        type: transaction.type,
      });
      return;
    }

    setForm({ ...defaultForm, date: new Date().toISOString().slice(0, 10) });
  }, [mode, open, transaction]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section className={styles.modal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{mode === "edit" ? t("Edit Transaction") : t("New Transaction")}</p>
            <h3 className={styles.title}>{mode === "edit" ? transaction?.name : t("Create a new transaction")}</h3>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
          <label className={styles.field}>
            <span>{t("Transaction Name")}</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Salary"
            />
          </label>

          <label className={styles.field}>
            <span>{t("Amount")}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            />
          </label>

          <label className={styles.field}>
            <span>{t("Date")}</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            />
          </label>

          <label className={styles.field}>
            <span>{t("Type")}</span>
            <select
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
            >
              <option value="income">{t("Income")}</option>
              <option value="expense">{t("Expenses")}</option>
            </select>
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>{t("Cancel")}</button>
            <button type="submit" className={styles.primaryButton} disabled={submitting}>
              {submitting ? t("Saving...") : mode === "edit" ? t("Save Changes") : t("Create Transaction")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
