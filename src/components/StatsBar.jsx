import { REVIEW_PLATFORMS } from '../data/apartment';
import { useSectionNavigation, isPlainLeftClick } from '../hooks/useSectionNavigation';
import styles from './StatsBar.module.css';

export default function StatsBar() {
  const goToSection = useSectionNavigation();

  return (
    <div id="stats" className={styles.bar} role="region" aria-label="Общий рейтинг гостей">
      <a
        href="/#reviews"
        className={styles.stat}
        onClick={(e) => {
          if (!isPlainLeftClick(e)) return;
          e.preventDefault();
          goToSection('reviews');
        }}
      >
        <strong className={styles.stars} aria-hidden="true">★★★★★</strong>
        <span className={styles.text}>
          отзывы гостей на {REVIEW_PLATFORMS.length} площадках · проверено 2026-08-01
        </span>
      </a>
    </div>
  );
}
