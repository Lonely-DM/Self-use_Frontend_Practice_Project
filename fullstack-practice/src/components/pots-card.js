"use client";

import Link from "next/link";
import styles from "@/styles/pots-card.module.css";
import { formatCurrency } from "@/lib/format";
import { useSettings } from "@/components/settings-provider";

export default function PotsCard({ pots = [], delay = 0 }) {
  const { t } = useSettings();
  const visiblePots = pots.slice(0, 3);

  return (
    <section className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t("Savings")}</p>
          <h2 className={styles.title}>{t("Pots")}</h2>
        </div>
        <Link href="/pots" className={styles.viewAll}>
          {t("View All")}
        </Link>
      </div>

      <div className={styles.list}>
        {visiblePots.map((pot) => {
          const progress = pot.target ? Math.min((pot.saved / pot.target) * 100, 100) : 0;

          return (
            <article key={pot.id} className={styles.item} style={{ "--pot-color": pot.color || "#277C78" }}>
              <div className={styles.row}>
                <h3 className={styles.name}>{pot.name}</h3>
                <span className={styles.amount}>{formatCurrency(pot.saved)}</span>
              </div>
              <div className={styles.metaRow}>
                <span>{t("Target")} {formatCurrency(pot.target)}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${progress}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
