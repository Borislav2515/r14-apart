import { motion } from 'framer-motion';
import { APARTMENT } from '../data/apartment';
import BookingWidget from './BookingWidget';
import styles from './Cta.module.css';

export default function Cta() {
  return (
    <section id="cta" className={styles.section} aria-label="Забронировать">
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${APARTMENT.images.cta})` }}
        aria-hidden="true"
      />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.content}>
        <motion.p
          className={styles.label}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          Готовы к заезду?
        </motion.p>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
        >
          Забронируйте<br /><em>R14-APART</em>
        </motion.h2>
        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
        >
          Онлайн-оплата · Подтверждение за 5 минут · Заезд 24/7
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className={styles.widgetWrap}>
            <BookingWidget containerId="hr-widget-cta" tag="site" />
          </div>
          <a href={`tel:${APARTMENT.phone.replace(/\s/g, '')}`} className={styles.btnOutline}>
            Позвонить нам
          </a>
        </motion.div>
      </div>
    </section>
  );
}
