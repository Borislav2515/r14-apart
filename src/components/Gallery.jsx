import { useEffect, useRef, useState } from 'react';
import { APARTMENT } from '../data/apartment';
import ResponsivePicture from './ResponsivePicture';
import styles from './Gallery.module.css';

const PANELS = [
  {
    image: APARTMENT.images.kitchen,
    label: 'Кухня',
    alt: 'Кухня R14-APART — полностью оборудованная кухня',
  },
  {
    image: APARTMENT.images.bedroom,
    label: 'Спальня',
    alt: 'Спальня R14-APART — комфортная кровать',
  },
  {
    image: APARTMENT.images.bathroom,
    label: 'Ванная',
    alt: 'Ванная R14-APART — современная ванная',
  },
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const touchStartX = useRef(null);

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
      <div id="gallery" className={styles.gallery} role="region" aria-label="Галерея интерьеров">
        {PANELS.map((p, i) => (
          <button
          key={p.alt}
          className={styles.panel}
          onClick={() => setActiveIndex(i)}
          aria-label={`Открыть фото: ${p.alt}`}
          >
            <ResponsivePicture
              image={p.image}
              alt={p.alt}
              className={styles.img}
              sizes="(max-width: 768px) 100vw, 33vw"
              fetchPriority="low"
            />
            <span className={styles.caption}>{p.label}</span>
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
          <div className={styles.lightboxFrame}>
            <button
              className={styles.lightboxClose}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(null);
              }}
              aria-label="Закрыть просмотр"
            >
              Закрыть
            </button>
            <ResponsivePicture
              image={PANELS[activeIndex].image}
              alt={PANELS[activeIndex].alt}
              className={styles.lightboxImg}
              sizes="100vw"
              loading="eager"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
            <span className={styles.counter}>{activeIndex + 1} / {PANELS.length}</span>
          </div>
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
