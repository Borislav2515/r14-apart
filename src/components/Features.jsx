import { motion } from 'framer-motion';
import { APARTMENT } from '../data/apartment';
import styles from './Features.module.css';

const reveal = (delay = 0, x = 0) => ({
  initial: { opacity: 0, y: x === 0 ? 40 : 0, x },
  whileInView: { opacity: 1, y: 0, x: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Features() {
  return (
    <section id="features" className={styles.section} aria-labelledby="feat-heading">
      <div className={styles.layout}>
        <motion.div className={styles.imgWrap} {...reveal(0, -40)}>
          <img
            src={APARTMENT.images.detail1}
            alt="Уютная гостиная апартаментов R14-APART"
            className={styles.imgMain}
            loading="lazy"
          />
          <img
            src={APARTMENT.images.detail2}
            alt="Детали интерьера R14-APART"
            className={styles.imgAccent}
            loading="lazy"
          />
        </motion.div>

        <div className={styles.right}>
          <motion.p className={styles.label} {...reveal(0)}>Почему R14-APART</motion.p>
          <motion.h2 className={styles.title} id="feat-heading" {...reveal(0.1)}>
            Всё<br />продумано<br /><em>за вас</em>
          </motion.h2>

          <ul className={styles.list} role="list">
            {APARTMENT.features.map((f, i) => (
              <motion.li key={f.title} className={styles.item} {...reveal(0.1 + i * 0.1)}>
                <div className={styles.icon} aria-hidden="true">{f.icon}</div>
                <div>
                  <h3 className={styles.itemTitle}>{f.title}</h3>
                  <p className={styles.itemText}>{f.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
