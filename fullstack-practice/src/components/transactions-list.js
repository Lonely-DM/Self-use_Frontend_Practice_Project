import styles from "@/styles/transactions-list.module.css";
import { formatCurrency, formatDate } from "@/lib/format";

export default function TransactionsList({ transactions = [], delay = 0 }) {
  return (
    <section className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Latest Activity</p>
          <h2 className={styles.title}>Transactions</h2>
        </div>
      </div>

      <div className={styles.list}>
        {transactions.map((transaction) => (
          <article key={transaction.id} className={styles.item}>
            <div>
              <h3 className={styles.name}>{transaction.name}</h3>
              <p className={styles.date}>{formatDate(transaction.date)}</p>
            </div>
            <div className={styles.right}>
              <span
                className={
                  transaction.type === "income" ? styles.incomeAmount : styles.expenseAmount
                }
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
              <p className={styles.type}>{transaction.type}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}