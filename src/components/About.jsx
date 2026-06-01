import { APARTMENT } from '../data/apartment';
import { useSectionNavigation } from '../hooks/useSectionNavigation';
import { trackBookingOpen } from '../utils/analytics';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './About.module.css';

export default function About() {
  const goToSection = useSectionNavigation();

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
          <ResponsivePicture
            image={APARTMENT.images.living}
            alt="R14-APART — дизайнерские апартаменты посуточно, гостиная"
            className={styles.mainImg}
            sizes="(max-width: 768px) 100vw, 1400px"
            loading="eager"
            fetchPriority="high"
            itemProp="image"
          />
          <div className={styles.badges}>
            <span className={styles.badge}>Апартаменты</span>
            <span className={styles.badge}>{APARTMENT.area} м²</span>
            <span className={styles.badge}>До {APARTMENT.guests} гостей</span>
          </div>
        </Reveal>

        {/* Sub images grid */}
        <div className={styles.subGrid}>
          {[
            {
              image: APARTMENT.images.bedroom,
              alt: 'Спальня R14-APART — удобная кровать, качественное бельё',
            },
            {
              image: APARTMENT.images.kitchen,
              alt: 'Кухня R14-APART — полностью оснащённая кухня',
            },
            {
              image: APARTMENT.images.bathroom,
              alt: 'Ванная R14-APART — современная ванная комната',
            },
          ].map((img, i) => (
            <Reveal
              key={img.alt}
              delay={0.1 * (i + 1)}
              y={40}
            >
              <ResponsivePicture
                image={img.image}
                alt={img.alt}
                className={styles.subImg}
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ filter: 'saturate(0.88)' }}
              />
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
            <div className={styles.chips}>
              {APARTMENT.amenities.map(a => (
                <span key={a.label} className={styles.chip}>
                  {a.label}
                </span>
              ))}
            </div>
          </div>
          <a
            href="/"
            className={styles.btnBook}
            onClick={e => {
              e.preventDefault();
              trackBookingOpen();
              goToSection('hero');
            }}
          >
            Забронировать онлайн
          </a>
        </Reveal>
      </div>
    </section>
  );
}
