import DashboardShell from "@/components/dashboard-shell";
import styles from "@/styles/budgets-page.module.css";

export default function BudgetsPage() {
  return (
    <DashboardShell title="Budgets" eyebrow="Section">
      <section className={styles.card}>
        {/* TODO: add budget editing, chart drilldowns, and category management. */}
        <p className={styles.label}>Budgets</p>
        <h2 className={styles.title}>Page scaffold ready</h2>
        <p className={styles.text}>
          The route is in place so we can expand budgets into a dedicated workflow next.
        </p>
      </section>
    </DashboardShell>
  );
}
