import styles from "@/styles/recurring-bills.module.css";
import { formatCurrency } from "@/lib/format";

const statusLabels = {
  paid: "Paid",
  upcoming: "Upcoming",
  due: "Due Soon",
};

export default function RecurringBills({ recurringBills = [], delay = 0 }) {
  return (
    <section className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Monthly Schedule</p>
          <h2 className={styles.title}>Recurring Bills</h2>
        </div>
      </div>

      <div className={styles.list}>
        {recurringBills.map((bill) => (
          <article key={bill.id} className={styles.item}>
            <div>
              <h3 className={styles.name}>{bill.name}</h3>
              <p className={styles.amount}>{formatCurrency(bill.amount)}</p>
            </div>
            <span className={`${styles.status} ${styles[bill.status]}`}>
              {statusLabels[bill.status] || bill.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}