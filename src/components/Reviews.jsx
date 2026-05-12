import { REVIEWS } from '../data/apartment';
import Reveal from './Reveal';
import styles from './Reviews.module.css';

const ALL = [...REVIEWS, ...REVIEWS]; // duplicate for seamless loop
const SOURCES = ['2ГИС', 'Яндекс Путешествия', 'Ostrovok'];
const DATES = ['апрель 2026', 'март 2026', 'февраль 2026', 'январь 2026', 'декабрь 2025'];

export default function Reviews() {
  return (
    <section className={styles.section} aria-labelledby="rev-heading">
      <Reveal as="p" className={styles.label} y={30}>
        Отзывы гостей
      </Reveal>
      <Reveal as="h2" className={styles.title} id="rev-heading" delay={0.1} y={30}>
        Они уже<br /><em>побывали</em>
      </Reveal>

      <div className={styles.trackWrap} role="region" aria-label="Лента отзывов">
        <div className={styles.track}>
          {ALL.map((r, i) => (
            <article
              key={`${r.id}-${i}`}
              className={styles.card}
              itemScope itemType="https://schema.org/Review"
            >
              <div className={styles.stars} aria-label={`${r.stars} из 5 звёзд`}>
                {'★'.repeat(r.stars)}
              </div>
              <p className={styles.text} itemProp="reviewBody">"{r.text}"</p>
              <div className={styles.meta}>
                <div className={styles.avatar} aria-hidden="true">{r.author[0]}</div>
                <div>
                  <p className={styles.author} itemProp="author">{r.author} · {r.city}</p>
                  <p className={styles.source}>{SOURCES[i % SOURCES.length]} · {DATES[i % DATES.length]}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
