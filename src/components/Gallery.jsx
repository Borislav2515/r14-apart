import { useEffect, useRef, useState } from 'react';
import { APARTMENT } from '../data/apartment';
import styles from './Gallery.module.css';

const PANELS = [
  {
    image: APARTMENT.images.kitchen,
    alt: 'Кухня R14-APART — полностью оборудованная кухня',
    speed: 0.12,
  },
  {
    image: APARTMENT.images.bedroom,
    alt: 'Спальня R14-APART — комфортная кровать',
    speed: 0.18,
  },
  {
    image: APARTMENT.images.bathroom,
    alt: 'Ванная R14-APART — современная ванная',
    speed: 0.12,
  },
];

export default function Gallery() {
  const refs = useRef([]);
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      let progress =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

      progress = Math.min(1, Math.max(0, progress));
      refs.current.forEach((el, i) => {
        if (!el) return;
        const dir = i === 1 ? -1 : 1;
        el.style.transform = `translateY(${dir * progress * PANELS[i].speed * 120 - 10}%)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((v) => (v + 1) % PANELS.length);
      if (e.key === 'ArrowLeft') setActiveIndex((v) => (v - 1 + PANELS.length) % PANELS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex]);

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
  
    const delta =
      e.changedTouches[0].clientX - touchStartX.current;
  
    touchStartX.current = null;
  
    if (Math.abs(delta) < 40) return;
  
    if (delta < 0) {
      setActiveIndex((v) => (v + 1) % PANELS.length);
    } else {
      setActiveIndex((v) => (v - 1 + PANELS.length) % PANELS.length);
    }
  };

  return (
    <>
      <div ref={sectionRef} id="gallery" className={styles.gallery} role="region" aria-label="Галерея интерьеров">
        {PANELS.map((p, i) => (
          <button
          ref={el => (refs.current[i] = el)}
          key={p.alt}
          className={styles.panel}
          onClick={() => setActiveIndex(i)}
          aria-label={`Открыть фото: ${p.alt}`}
          >
            <picture>
              <source
                srcSet={p.image.avif}
                type="image/avif"
              />

              <source
                srcSet={p.image.webp}
                type="image/webp"
              />

            <img
              src={p.image.jpg}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className={styles.img}
            />
            </picture>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveIndex(null);
            }
          }}
        >
          <button
            className={styles.lightboxBtn}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((v) => (v - 1 + PANELS.length) % PANELS.length);
            }}
            aria-label="Предыдущее фото"
          >
            ←
          </button>
          <picture>
            <source
              srcSet={PANELS[activeIndex].image.avif}
              type="image/avif"
            />

            <source
              srcSet={PANELS[activeIndex].image.webp}
              type="image/webp"
            />

            <img
              src={PANELS[activeIndex].image.jpg}
              alt={PANELS[activeIndex].alt}
              className={styles.lightboxImg}
              decoding="async"
              loading="eager"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
          </picture>
          <button
            className={styles.lightboxBtn}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((v) => (v + 1) % PANELS.length);
            }}
            aria-label="Следующее фото"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
