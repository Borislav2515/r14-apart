import { STATS } from '../data/apartment';
import { useCounter } from '../hooks/useCounter';
import styles from './StatsBar.module.css';

function StatItem({ value, label, decimal, delay }) {
  const [ref, display] = useCounter(value, { decimal });
  return (
    <div ref={ref} className={styles.item} style={{ transitionDelay: `${delay}ms` }}>
      <span className={styles.num}>{display}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div id="stats" className={styles.bar} role="region" aria-label="Ключевые показатели">
      <div className={styles.inner}>
        {STATS.map((s, i) => (
          <StatItem key={s.label} value={s.value} label={s.label} decimal={s.decimal} delay={i * 80} />
        ))}
      </div>
    </div>
  );
}
