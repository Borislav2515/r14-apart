import { useState } from 'react';
import { REVIEW_PLATFORMS, REVIEWS } from '../data/apartment';
import Reveal from './Reveal';
import styles from './Reviews.module.css';

const ALL = [...REVIEWS, ...REVIEWS]; // duplicate for seamless loop
const platformByBrand = Object.fromEntries(REVIEW_PLATFORMS.map((platform) => [platform.brand, platform]));
const sourceForReview = (review) => (
  review.source === 'Яндекс Карты' ? platformByBrand.yandex : platformByBrand.ostrovok
);

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
            <a
              key={`${r.id}-${i}`}
              href={sourceForReview(r)?.href}
              className={styles.card}
              target="_blank"
              rel="noopener"
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
            </a>
          ))}
        </div>
      </div>

      <Reveal as="p" className={styles.sources} y={18}>
        Все отзывы:{' '}
        <a href={platformByBrand.yandex.href} target="_blank" rel="noopener">
          Яндекс Карты (4.6, 10 отзывов)
        </a>
        {' · '}
        <a href={platformByBrand.ostrovok.href} target="_blank" rel="noopener">
          Островок (10/10, 11 отзывов)
        </a>
      </Reveal>
    </section>
  );
}
