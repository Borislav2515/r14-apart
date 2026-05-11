import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { APARTMENT } from '../data/apartment';
import BookingWidget from './BookingWidget';
import styles from './Hero.module.css';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Hero() {
  const bgRef = useRef(null);

  // Parallax on scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (!bgRef.current) {
          ticking = false;
          return;
        }
        const y = window.scrollY;
        if (y < window.innerHeight) {
          bgRef.current.style.transform = `scale(1.1) translateY(${y * 0.28}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="hero" className={styles.hero} aria-label="Главный экран">
      <div
        ref={bgRef}
        className={styles.bg}
        role="img"
        aria-label="Интерьер апартаментов R14-APART"
        style={{ backgroundImage: `url(${APARTMENT.images.hero})` }}
      />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.content}>
        <motion.p className={styles.eyebrow} {...fade(0.3)}>
          Исторический центр Владикавказа · Бронирование онлайн
        </motion.p>

        <motion.h1 className={styles.title} {...fade(0.55)}>
          R14<span className={styles.dot}>·</span>
          <br />
          <em>APART</em>
        </motion.h1>

        <motion.p className={styles.subtitle} {...fade(0.8)}>
          Двухуровневые апартаменты посуточно во Владикавказе: ул. Революции, 14. Умный дом, бесконтактное заселение 24/7 по паролю, тихая улица в историческом центре.
        </motion.p>

        <motion.div className={styles.widgetWrap} {...fade(1.0)}>
          <BookingWidget containerId="hr-widget-hero" tag="site-hero" />
        </motion.div>
      </div>

      <motion.div
        className={styles.scroll}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div className={styles.scrollLine} />
        <span>Скролл</span>
      </motion.div>
    </section>
  );
}
