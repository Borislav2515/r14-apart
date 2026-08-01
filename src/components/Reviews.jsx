import { useState } from 'react';
import { REVIEWS } from '../data/apartment';
import Reveal from './Reveal';
import styles from './Reviews.module.css';

const ALL = [...REVIEWS, ...REVIEWS]; // duplicate for seamless loop

export default function Reviews() {
  const [paused, setPaused] = useState(false);

  return (
    <section className={styles.section} aria-labelledby="rev-heading">
      <Reveal as="h2" className={styles.title} id="rev-heading" delay={0.1} y={30}>
        Они уже<br /><em>побывали</em>
      </Reveal>

      <button
        type="button"
        className={styles.pauseBtn}
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        aria-label={paused ? 'Возобновить автопрокрутку отзывов' : 'Остановить автопрокрутку отзывов'}
      >
        {paused ? '▶' : '❚❚'}
      </button>

      <div className={styles.trackWrap} role="region" aria-label="Лента отзывов">
        <div className={`${styles.track} ${paused ? styles.paused : ''}`}>
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
                  <p className={styles.author} itemProp="author">{r.author}</p>
                  <p className={styles.source}>{r.source}{r.date ? `, ${r.date}` : ''}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
