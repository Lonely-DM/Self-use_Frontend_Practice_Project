"use client";

import Link from "next/link";
import styles from "@/styles/transactions-list.module.css";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSettings } from "@/components/settings-provider";

function TransactionsList({ transactions = [], delay = 0 }) {
  const { t } = useSettings();
  const visibleTransactions = transactions.slice(0, 5);

  return (
    <section className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t("Latest Activity")}</p>
          <h2 className={styles.title}>{t("Transactions")}</h2>
        </div>
        <Link href="/transactions" className={styles.viewAll}>
          {t("View All")}
        </Link>
      </div>

      <div className={styles.list}>
        {visibleTransactions.map((transaction) => (
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
              <p className={styles.type}>{t(transaction.type === "income" ? "Income" : "Expenses")}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { TransactionsList };
export default TransactionsList;
