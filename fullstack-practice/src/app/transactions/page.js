import DashboardShell from "@/components/dashboard-shell";
import styles from "@/styles/transactions-page.module.css";

export default function TransactionsPage() {
  return (
    <DashboardShell title="Transactions" eyebrow="Section">
      <section className={styles.card}>
        {/* TODO: add transactions filters, table, and create/edit flows. */}
        <p className={styles.label}>Transactions</p>
        <h2 className={styles.title}>Page scaffold ready</h2>
        <p className={styles.text}>
          This route is connected to the sidebar and ready for the next round of feature work.
        </p>
      </section>
    </DashboardShell>
  );
}
