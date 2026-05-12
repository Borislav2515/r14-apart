import { motion } from 'framer-motion';
import { APARTMENT } from '../data/apartment';
import { useSectionNavigation } from '../hooks/useSectionNavigation';
import ResponsivePicture from './ResponsivePicture';
import styles from './Cta.module.css';

export default function Cta() {
  const goToSection = useSectionNavigation();

  return (
    <section className={styles.section} aria-label="Забронировать">
      <div className={styles.bg} aria-hidden="true">
        <ResponsivePicture
          image={APARTMENT.images.hero}
          alt=""
          className={styles.bgImg}
          sizes="100vw"
        />
      </div>
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
          className={styles.actions}
        >
          <a
            href="/"
            className={styles.btnSolid}
            onClick={(e) => {
              e.preventDefault();
              goToSection('hero');
            }}
          >
            Открыть форму бронирования
          </a>
          <a href={`tel:${APARTMENT.phone.replace(/\s/g, '')}`} className={styles.btnOutline}>
            Позвонить нам
          </a>
        </motion.div>
      </div>
    </section>
  );
}
