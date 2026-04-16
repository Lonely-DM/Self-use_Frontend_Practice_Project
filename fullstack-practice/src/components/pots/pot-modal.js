"use client";

import { useEffect, useState } from "react";
import styles from "./pot-modal.module.css";

const defaultForm = {
  name: "",
  target: "",
  saved: "0",
  color: "#277C78",
};

export default function PotModal({ open, mode, pot, onClose, onSubmit, submitting, t = (value) => value }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && pot) {
      setForm({
        name: pot.name,
        target: String(pot.target),
        saved: String(pot.saved),
        color: pot.color || "#277C78",
      });
      return;
    }

    setForm(defaultForm);
  }, [mode, open, pot]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section className={styles.modal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{mode === "edit" ? t("Edit Pot") : t("New Pot")}</p>
            <h3 className={styles.title}>{mode === "edit" ? pot?.name : t("Create a new savings goal")}</h3>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
        >
          <label className={styles.field}>
            <span>{t("Name")}</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Vacation Fund"
            />
          </label>

          <label className={styles.field}>
            <span>{t("Target")}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.target}
              onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
            />
          </label>

          {mode === "new" ? (
            <label className={styles.field}>
              <span>{t("Saved")}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.saved}
                onChange={(event) => setForm((current) => ({ ...current, saved: event.target.value }))}
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
                <span className={styles.colorHint}>{t("Pick a pot accent color")}</span>
              </div>
            </div>
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>{t("Cancel")}</button>
            <button type="submit" className={styles.primaryButton} disabled={submitting}>
              {submitting ? t("Saving...") : mode === "edit" ? t("Save Changes") : t("Create Pot")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
