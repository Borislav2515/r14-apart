import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { APARTMENT } from '../data/apartment';
import styles from './About.module.css';

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-heading">
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
        <picture itemProp="image">

        <source

          srcSet={APARTMENT.images.living.avif}

          type="image/avif"

        />

        <source

          srcSet={APARTMENT.images.living.webp}

          type="image/webp"

        />

        <img

          src={APARTMENT.images.living.jpg}

          alt="R14-APART — дизайнерские апартаменты посуточно, гостиная"

          className={styles.mainImg}

          loading="eager"

          decoding="async"

          fetchPriority="high"

        />

        </picture>
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
              <picture>
                <source srcSet={img.image.avif} type="image/avif" />
                <source srcSet={img.image.webp} type="image/webp" />

                <img
                  src={img.image.jpg}
                  alt={img.alt}
                  className={styles.subImg}
                  loading="lazy"
                  style={{ filter: 'saturate(0.88)' }}
                />
              </picture>
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
            href="#hero"
            className={styles.btnBook}
            onClick={e => {
              e.preventDefault();
              document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Забронировать онлайн
          </a>
        </motion.div>
      </div>
    </section>
  );
}
