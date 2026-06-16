import { useEffect, useRef, useState } from 'react';
import { REVIEW_PLATFORMS } from '../data/apartment';
import styles from './StatsBar.module.css';

function BrandIcon({ brand }) {
  if (brand === 'avito') {
    return (
      <span className={`${styles.icon} ${styles.avitoIcon}`} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  }

  return <span className={`${styles.icon} ${styles[`${brand}Icon`]}`} aria-hidden="true" />;
}

export default function StatsBar() {
  const centerIndex = Math.floor(REVIEW_PLATFORMS.length / 2);
  const [activeIndex, setActiveIndex] = useState(centerIndex);
  const scrollerRef = useRef(null);
  const centerRef = useRef(null);

  useEffect(() => {
    centerRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    let frame = 0;

    const updateActive = () => {
      frame = 0;
      const scrollerRect = scroller.getBoundingClientRect();
      const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
      const cards = Array.from(scroller.querySelectorAll('[data-platform-card]'));

      const closest = cards.reduce(
        (current, card, index) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(scrollerCenter - cardCenter);
          return distance < current.distance ? { index, distance } : current;
        },
        { index: centerIndex, distance: Number.POSITIVE_INFINITY }
      );

      setActiveIndex((current) => (current === closest.index ? current : closest.index));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [centerIndex]);

  return (
    <div id="stats" className={styles.bar} role="region" aria-label="Отзывы на площадках">
      <div
        ref={scrollerRef}
        className={styles.scroller}
        tabIndex={0}
        aria-label="Площадки с отзывами, прокрутка по горизонтали"
      >
        {REVIEW_PLATFORMS.map((platform, index) => (
          <a
            key={platform.name}
            ref={index === centerIndex ? centerRef : undefined}
            data-platform-card
            href={platform.href}
            className={`${styles.card} ${index === activeIndex ? styles.featured : ''}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.brand}>
              <BrandIcon brand={platform.brand} />
              <span className={styles.name}>{platform.name}</span>
            </span>
            <strong className={styles.stars} aria-label={platform.rating}>★★★★★</strong>
            <span
  className={styles.score}
  style={{ backgroundColor: platform.color }}
>
  {platform.score}
</span>
            <span className={styles.reviews}>{platform.reviews}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
