import styles from "@/styles/budget-chart.module.css";
import { formatCurrency } from "@/lib/format";

const colors = ["#277C78", "#82C9D7", "#F2CDAC", "#626070"];

export default function BudgetChart({ budgets = [], delay = 0 }) {
  const totalSpent = budgets.reduce((sum, item) => sum + Number(item.spent || 0), 0);
  const totalBudget = budgets.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const circumference = 2 * Math.PI * 54;
  const segments = budgets.reduce((acc, item, index) => {
    const ratio = totalSpent ? Number(item.spent || 0) / totalSpent : 0;
    const segmentLength = circumference * ratio;
    const previousOffset = acc.length
      ? acc[acc.length - 1].offset - acc[acc.length - 1].segmentLength
      : 0;

    acc.push({
      id: item.id,
      category: item.category,
      amount: item.amount,
      spent: item.spent,
      color: colors[index % colors.length],
      segmentLength,
      offset: previousOffset,
      animationDelay: `${delay + index * 0.1}s`,
    });

    return acc;
  }, []);

  return (
    <section className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Budget Status</p>
          <h2 className={styles.title}>Budget Chart</h2>
        </div>
      </div>

      <div className={styles.chartLayout}>
        <div className={styles.chartWrap}>
          <svg viewBox="0 0 140 140" className={styles.chart} aria-label="Budget allocation chart">
            <circle cx="70" cy="70" r="54" className={styles.track} />
            {segments.map((segment) => (
              <circle
                key={segment.id}
                cx="70"
                cy="70"
                r="54"
                className={styles.segment}
                style={{
                  "--segment-length": segment.segmentLength,
                  "--circumference": circumference,
                  "--offset": segment.offset,
                  "--segment-color": segment.color,
                  animationDelay: segment.animationDelay,
                }}
              />
            ))}
          </svg>
          <div className={styles.chartCenter}>
            <span className={styles.centerLabel}>Spent</span>
            <span className={styles.centerValue}>{formatCurrency(totalSpent)}</span>
            <span className={styles.centerHint}>of {formatCurrency(totalBudget)}</span>
          </div>
        </div>

        <div className={styles.legend}>
          {segments.map((segment) => (
            <article key={segment.id} className={styles.legendItem}>
              <span className={styles.swatch} style={{ backgroundColor: segment.color }} />
              <div>
                <p className={styles.legendName}>{segment.category}</p>
                <p className={styles.legendMeta}>
                  {formatCurrency(segment.spent)} / {formatCurrency(segment.amount)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
