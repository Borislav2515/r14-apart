import { useEffect, useRef, useState } from 'react';
import { APARTMENT } from '../data/apartment';
import { useBookingModal } from '../context/BookingModalContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { trackBookingOpen, trackGalleryOpen } from '../utils/analytics';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './About.module.css';

const AMENITY_GROUPS = ['Комфорт', 'Умный дом', 'Быт'];
const GALLERY_ZONES = ['Все', 'Гостиная', 'Кухня', 'Спальня', 'Ванная', 'Второй уровень', 'Вход и подъезд', 'Вид из окна', 'Детали'];

const PHOTOS = [
  {
    image: APARTMENT.images.living,
    alt: 'R14-APART — гостиная, диван и двухуровневое пространство',
    label: 'Гостиная',
    zone: 'Гостиная',
    width: 1400,
    height: 875,
  },
  {
    image: APARTMENT.images.bedroom,
    alt: 'R14-APART — спальня, кровать и качественное бельё',
    label: 'Спальня',
    zone: 'Спальня',
    width: 1400,
    height: 875,
  },
  {
    image: APARTMENT.images.kitchen,
    alt: 'R14-APART — кухня, рабочая зона и техника',
    label: 'Кухня',
    zone: 'Кухня',
    width: 1400,
    height: 875,
  },
  {
    image: APARTMENT.images.bathroom,
    alt: 'R14-APART — ванная, современная ванная комната',
    label: 'Ванная',
    zone: 'Ванная',
    width: 1400,
    height: 875,
  },
];

export default function About() {
  const { open: openBooking } = useBookingModal();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeZone, setActiveZone] = useState('Все');
  const touchStartX = useRef(null);
  const lightboxRef = useRef(null);
  const closeBtnRef = useRef(null);
  const visiblePhotos = activeZone === 'Все' ? PHOTOS : PHOTOS.filter((photo) => photo.zone === activeZone);
  const leadPhoto = visiblePhotos[0] ?? PHOTOS[0];
  const availableZones = GALLERY_ZONES.filter((zone) => zone === 'Все' || PHOTOS.some((photo) => photo.zone === zone));

  useFocusTrap(activeIndex !== null, lightboxRef, { initialFocusRef: closeBtnRef });

  useEffect(() => {
      if (activeIndex === null) return undefined;
      const onKey = (e) => {
        if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((v) => (v + 1) % visiblePhotos.length);
      if (e.key === 'ArrowLeft') setActiveIndex((v) => (v - 1 + visiblePhotos.length) % visiblePhotos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, visiblePhotos.length]);

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
      setActiveIndex((v) => (v + 1) % visiblePhotos.length);
    } else {
      setActiveIndex((v) => (v - 1 + visiblePhotos.length) % visiblePhotos.length);
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
        <Reveal className={styles.galleryFilters} y={24}>
          {availableZones.map((zone) => (
            <button
              key={zone}
              type="button"
              className={`${styles.filterBtn} ${activeZone === zone ? styles.filterActive : ''}`}
              onClick={() => {
                setActiveZone(zone);
                setActiveIndex(null);
              }}
              aria-pressed={activeZone === zone}
            >
              {zone}
            </button>
          ))}
        </Reveal>

        {/* Main image */}
        <Reveal className={styles.mainWrap} y={40}>
          <button
            type="button"
            className={styles.mainBtn}
            onClick={() => openLightbox(0)}
            aria-label={`Открыть фото: ${leadPhoto.alt}`}
          >
            <ResponsivePicture
              image={leadPhoto.image}
              alt={leadPhoto.alt}
              className={styles.mainImg}
              sizes="(max-width: 768px) 100vw, 1400px"
              loading="eager"
              fetchPriority="high"
              width={leadPhoto.width}
              height={leadPhoto.height}
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
          {visiblePhotos.slice(1).map((photo, i) => (
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
                  width={photo.width}
                  height={photo.height}
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
              trackBookingOpen({ placement: 'about' });
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
              setActiveIndex((v) => (v - 1 + visiblePhotos.length) % visiblePhotos.length);
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
              image={visiblePhotos[activeIndex].image}
              alt={visiblePhotos[activeIndex].alt}
              className={styles.lightboxImg}
              sizes="100vw"
              loading="eager"
              width={visiblePhotos[activeIndex].width}
              height={visiblePhotos[activeIndex].height}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
            <span className={styles.counter}>{activeIndex + 1} / {visiblePhotos.length}</span>
          </div>
          <button
            className={styles.lightboxBtn}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((v) => (v + 1) % visiblePhotos.length);
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
