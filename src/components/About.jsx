import { useEffect, useRef, useState } from 'react';
import { APARTMENT } from '../data/apartment';
import { useBookingModal } from '../context/BookingModalContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { trackBookingOpen, trackGalleryOpen } from '../utils/analytics';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './About.module.css';

const AMENITY_GROUPS = ['Комфорт', 'Умный дом', 'Быт'];

const PHOTOS = [
  {
    image: APARTMENT.images.living,
    alt: 'R14-APART — дизайнерские апартаменты посуточно, гостиная',
    label: 'Гостиная',
  },
  {
    image: APARTMENT.images.bedroom,
    alt: 'Спальня R14-APART — удобная кровать, качественное бельё',
    label: 'Спальня',
  },
  {
    image: APARTMENT.images.kitchen,
    alt: 'Кухня R14-APART — полностью оснащённая кухня',
    label: 'Кухня',
  },
  {
    image: APARTMENT.images.bathroom,
    alt: 'Ванная R14-APART — современная ванная комната',
    label: 'Ванная',
  },
];

export default function About() {
  const { open: openBooking } = useBookingModal();
  const [activeIndex, setActiveIndex] = useState(null);
  const touchStartX = useRef(null);
  const lightboxRef = useRef(null);
  const closeBtnRef = useRef(null);

  useFocusTrap(activeIndex !== null, lightboxRef, { initialFocusRef: closeBtnRef });

  useEffect(() => {
    if (activeIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((v) => (v + 1) % PHOTOS.length);
      if (e.key === 'ArrowLeft') setActiveIndex((v) => (v - 1 + PHOTOS.length) % PHOTOS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex]);

  const openLightbox = (index) => {
    trackGalleryOpen();
    setActiveIndex(index);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 40) return;

    if (delta < 0) {
      setActiveIndex((v) => (v + 1) % PHOTOS.length);
    } else {
      setActiveIndex((v) => (v - 1 + PHOTOS.length) % PHOTOS.length);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="about-heading">
      <div className={styles.header}>
        <Reveal y={40}>
          <p className={styles.label}>Апартаменты во Владикавказе</p>
          <h2 className={styles.title} id="about-heading">
            R14<span className={styles.dot}>·</span>
            <br />
            <em>APART</em>
          </h2>
        </Reveal>
        <Reveal as="p" className={styles.headerDesc} delay={0.1} y={40}>
          Квартира посуточно и двухуровневые апартаменты в историческом центре Владикавказа. Отдельный вход с улицы, тихая локация рядом с проспектом Мира, парком, музеями и театром.
        </Reveal>
      </div>

      <div className={styles.showcase} itemScope itemType="https://schema.org/Apartment">
        {/* Main image */}
        <Reveal className={styles.mainWrap} y={40}>
          <button
            type="button"
            className={styles.mainBtn}
            onClick={() => openLightbox(0)}
            aria-label={`Открыть фото: ${PHOTOS[0].alt}`}
          >
            <ResponsivePicture
              image={PHOTOS[0].image}
              alt={PHOTOS[0].alt}
              className={styles.mainImg}
              sizes="(max-width: 768px) 100vw, 1400px"
              loading="eager"
              fetchPriority="high"
              itemProp="image"
            />
          </button>
          <div className={styles.badges} aria-hidden="true">
            <span className={styles.badge}>Апартаменты</span>
            <span className={styles.badge}>{APARTMENT.area} м²</span>
            <span className={styles.badge}>До {APARTMENT.guests} гостей</span>
          </div>
        </Reveal>

        {/* Sub images grid */}
        <div className={styles.subGrid}>
          {PHOTOS.slice(1).map((photo, i) => (
            <Reveal key={photo.alt} delay={0.1 * (i + 1)} y={40}>
              <button
                type="button"
                className={styles.subBtn}
                onClick={() => openLightbox(i + 1)}
                aria-label={`Открыть фото: ${photo.alt}`}
              >
                <ResponsivePicture
                  image={photo.image}
                  alt={photo.alt}
                  className={styles.subImg}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ filter: 'saturate(0.88)' }}
                />
                <span className={styles.subCaption}>{photo.label}</span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Description + amenities */}
        <Reveal className={styles.info} delay={0.15} y={40}>
          <div className={styles.desc}>
            <h3 className={styles.descTitle} itemProp="name">
              Премиум-уют в центре<br />и бесконтактный комфорт
            </h3>
            <p className={styles.descText} itemProp="description">
              {APARTMENT.description}
            </p>
            <div className={styles.amenityGroups}>
              {AMENITY_GROUPS.map((group) => (
                <div key={group} className={styles.amenityGroup}>
                  <p className={styles.amenityGroupLabel}>{group}</p>
                  <div className={styles.chips}>
                    {APARTMENT.amenities.filter(a => a.group === group).map(a => (
                      <span key={a.label} className={styles.chip}>
                        {a.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={styles.btnBook}
            onClick={() => {
              trackBookingOpen();
              openBooking();
            }}
          >
            Забронировать онлайн
          </button>
        </Reveal>
      </div>

      {activeIndex !== null && (
        <div
          ref={lightboxRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveIndex(null);
          }}
        >
          <button
            className={styles.lightboxBtn}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((v) => (v - 1 + PHOTOS.length) % PHOTOS.length);
            }}
            aria-label="Предыдущее фото"
          >
            ←
          </button>
          <div className={styles.lightboxFrame}>
            <button
              ref={closeBtnRef}
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
              image={PHOTOS[activeIndex].image}
              alt={PHOTOS[activeIndex].alt}
              className={styles.lightboxImg}
              sizes="100vw"
              loading="eager"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
            <span className={styles.counter}>{activeIndex + 1} / {PHOTOS.length}</span>
          </div>
          <button
            className={styles.lightboxBtn}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((v) => (v + 1) % PHOTOS.length);
            }}
            aria-label="Следующее фото"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
