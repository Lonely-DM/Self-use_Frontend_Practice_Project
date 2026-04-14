import styles from "@/styles/pots-card.module.css";
import { formatCurrency } from "@/lib/format";

export default function PotsCard({ pots = [], delay = 0 }) {
  return (
    <section className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Savings</p>
          <h2 className={styles.title}>Pots</h2>
        </div>
      </div>

      <div className={styles.list}>
        {pots.map((pot) => {
          const progress = pot.target ? Math.min((pot.saved / pot.target) * 100, 100) : 0;

          return (
            <article key={pot.id} className={styles.item}>
              <div className={styles.row}>
                <h3 className={styles.name}>{pot.name}</h3>
                <span className={styles.amount}>{formatCurrency(pot.saved)}</span>
              </div>
              <div className={styles.metaRow}>
                <span>Target {formatCurrency(pot.target)}</span>
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