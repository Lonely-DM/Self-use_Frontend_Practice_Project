import DashboardShell from "@/components/dashboard-shell";
import styles from "@/styles/pots-page.module.css";

export default function PotsPage() {
  return (
    <DashboardShell title="Pots" eyebrow="Section">
      <section className={styles.card}>
        {/* TODO: add savings pot CRUD, target tracking, and contribution history. */}
        <p className={styles.label}>Pots</p>
        <h2 className={styles.title}>Page scaffold ready</h2>
        <p className={styles.text}>
          This placeholder page keeps the route stable while the dedicated savings experience is built.
        </p>
      </section>
    </DashboardShell>
  );
}
