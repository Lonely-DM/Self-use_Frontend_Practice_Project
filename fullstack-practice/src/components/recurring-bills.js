"use client";

import Link from "next/link";
import styles from "@/styles/recurring-bills.module.css";
import { formatCurrency } from "@/lib/format";
import { useSettings } from "@/components/settings-provider";

const statusLabels = {
  paid: "Paid",
  upcoming: "Upcoming",
  due: "Due Soon",
};

export default function RecurringBills({ recurringBills = [], delay = 0 }) {
  const { t } = useSettings();
  const visibleBills = recurringBills.slice(0, 4);

  return (
    <section className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t("Monthly Schedule")}</p>
          <h2 className={styles.title}>{t("Recurring Bills")}</h2>
        </div>
        <Link href="/recurring-bills" className={styles.viewAll}>
          {t("View All")}
        </Link>
      </div>

      <div className={styles.list}>
        {visibleBills.length ? (
          visibleBills.map((bill) => (
            <article key={bill.id} className={styles.item}>
              <div>
                <h3 className={styles.name}>{bill.name}</h3>
                <p className={styles.amount}>{formatCurrency(bill.amount)}</p>
              </div>
              <span className={`${styles.status} ${styles[bill.status]}`}>
                {t(statusLabels[bill.status] || bill.status)}
              </span>
            </article>
          ))
        ) : (
          <div className={styles.emptyState}>No recurring bills yet.</div>
        )}
      </div>
    </section>
  );
}
