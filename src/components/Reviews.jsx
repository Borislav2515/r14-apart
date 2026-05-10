import { motion } from 'framer-motion';
import { REVIEWS } from '../data/apartment';
import styles from './Reviews.module.css';

const ALL = [...REVIEWS, ...REVIEWS]; // duplicate for seamless loop
const SOURCES = ['2ГИС', 'Яндекс Путешествия', 'Ostrovok'];
const DATES = ['апрель 2026', 'март 2026', 'февраль 2026', 'январь 2026', 'декабрь 2025'];

export default function Reviews() {
  return (
    <section id="reviews" className={styles.section} aria-labelledby="rev-heading">
      <motion.p
        className={styles.label}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}
      >
        Отзывы гостей
      </motion.p>
      <motion.h2
        className={styles.title} id="rev-heading"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
      >
        Они уже<br /><em>побывали</em>
      </motion.h2>

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
