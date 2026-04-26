"use client";

import { useEffect, useState } from "react";
import styles from "./recurring-bill-modal.module.css";

const defaultForm = {
  name: "",
  amount: "",
  status: "upcoming",
};

export default function RecurringBillModal({ open, mode, bill, onClose, onSubmit, submitting, t = (value) => value }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && bill) {
      setForm({
        name: bill.name,
        amount: String(bill.amount),
        status: bill.status,
      });
      return;
    }

    setForm(defaultForm);
  }, [bill, mode, open]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section className={styles.modal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{mode === "edit" ? t("Edit Bill") : t("New Bill")}</p>
            <h3 className={styles.title}>{mode === "edit" ? bill?.name : t("Create a recurring bill")}</h3>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
          <label className={styles.field}>
            <span>{t("Bill Name")}</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Internet"
            />
          </label>

          <label className={styles.field}>
            <span>{t("Bill Amount")}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            />
          </label>

          <label className={styles.field}>
            <span>{t("Status")}</span>
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="paid">{t("Paid")}</option>
              <option value="upcoming">{t("Upcoming")}</option>
              <option value="due">{t("Due Soon")}</option>
            </select>
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>{t("Cancel")}</button>
            <button type="submit" className={styles.primaryButton} disabled={submitting}>
              {submitting ? t("Saving...") : mode === "edit" ? t("Save Changes") : t("Create Bill")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
