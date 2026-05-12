import { motion } from 'framer-motion';
import { APARTMENT } from '../data/apartment';
import { useSectionNavigation } from '../hooks/useSectionNavigation';
import ResponsivePicture from './ResponsivePicture';
import styles from './About.module.css';

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function About() {
  const goToSection = useSectionNavigation();

  return (
    <section className={styles.section} aria-labelledby="about-heading">
      <div className={styles.header}>
        <motion.div {...reveal(0)}>
          <p className={styles.label}>Апартаменты во Владикавказе</p>
          <h2 className={styles.title} id="about-heading">
            R14<span className={styles.dot}>·</span>
            <br />
            <em>APART</em>
          </h2>
        </motion.div>
        <motion.p className={styles.headerDesc} {...reveal(0.1)}>
          Двухуровневые апартаменты посуточно в историческом центре Владикавказа. Отдельный вход с улицы, тихая локация рядом с проспектом Мира, парком, музеями и театром.
        </motion.p>
      </div>

      <div className={styles.showcase} itemScope itemType="https://schema.org/Apartment">
        {/* Main image */}
        <motion.div className={styles.mainWrap} {...reveal(0)}>
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
        </motion.div>

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
            <motion.div
              key={img.alt}
              {...reveal(0.1 * (i + 1))}
              whileHover={{ scale: 1.03, filter: 'saturate(1.15)' }}
              transition={{ duration: 0.5 }}
            >
              <ResponsivePicture
                image={img.image}
                alt={img.alt}
                className={styles.subImg}
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ filter: 'saturate(0.88)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Description + amenities */}
        <motion.div className={styles.info} {...reveal(0.15)}>
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
              goToSection('hero');
            }}
          >
            Забронировать онлайн
          </a>
        </motion.div>
      </div>
    </section>
  );
}
