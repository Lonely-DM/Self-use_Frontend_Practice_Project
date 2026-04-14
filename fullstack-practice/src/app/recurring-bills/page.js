import DashboardShell from "@/components/dashboard-shell";
import styles from "@/styles/recurring-bills-page.module.css";

export default function RecurringBillsPage() {
  return (
    <DashboardShell title="Recurring Bills" eyebrow="Section">
      <section className={styles.card}>
        {/* TODO: add bill reminders, due status actions, and schedule management. */}
        <p className={styles.label}>Recurring Bills</p>
        <h2 className={styles.title}>Page scaffold ready</h2>
        <p className={styles.text}>
          Navigation is wired up and waiting for the recurring bills management UI.
        </p>
      </section>
    </DashboardShell>
  );
}
