import { useEffect, useRef } from 'react';
import { APARTMENT } from '../data/apartment';
import { trackTelegram, trackWhatsapp, telegramHref, whatsappHref } from '../utils/analytics';
import { useBookingModal } from '../context/BookingModalContext';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const { setHeroSlot } = useBookingModal();

  // Parallax on scroll
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotion.matches) {
      if (bgRef.current) bgRef.current.style.transform = 'translate3d(0, 0, 0) scale(1.04)';
      return undefined;
    }

    const mobileViewport = window.matchMedia('(max-width: 768px)');
    let frameId = 0;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const render = () => {
      frameId = 0;
      if (!heroRef.current || !bgRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const factor = mobileViewport.matches ? 0.14 : 0.28;
      const maxOffset = viewportHeight * (mobileViewport.matches ? 0.12 : 0.24);

      const offset = rect.bottom > 0 && rect.top < viewportHeight
        ? clamp(-rect.top * factor, 0, maxOffset)
        : 0;

      bgRef.current.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.04)`;
    };

    const update = () => {
      if (!frameId) frameId = window.requestAnimationFrame(render);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className={styles.hero} aria-label="Главный экран">
      <div
        ref={bgRef}
        className={styles.bg}
        aria-hidden="true"
      >
        <ResponsivePicture
          image={APARTMENT.images.hero}
          alt=""
          className={styles.bgImg}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.content}>
        <Reveal as="p" className={styles.eyebrow} delay={0.3} y={24} immediate>
          Исторический центр Владикавказа · Бронирование онлайн
        </Reveal>

        <Reveal as="h1" className={styles.title} delay={0.55} y={24} immediate>
          <span className={styles.brandLine}>
            R14<span className={styles.dot}>·</span>
            <br />
            <em>APART</em>
          </span>
          <span className={styles.seoLine}>Квартира посуточно во Владикавказе</span>
        </Reveal>

        <Reveal as="p" className={styles.subtitle} delay={0.8} y={24} immediate>
          Квартира посуточно во Владикавказе: ул. Революции, 14. Двухуровневые апартаменты в центре, умный дом, бесконтактное заселение 24/7 по паролю и прямое бронирование.
        </Reveal>

        <Reveal className={styles.facts} delay={0.9} y={20} immediate>
          <span>{APARTMENT.address}</span>
          <span>от {APARTMENT.priceFrom.toLocaleString('ru-RU')} ₽/сутки</span>
          <span>до {APARTMENT.guests} гостей</span>
          <span>самостоятельное заселение</span>
        </Reveal>

        <Reveal className={styles.widgetWrap} delay={0.96} y={24} immediate>
          <div ref={setHeroSlot} />
        </Reveal>

        <Reveal className={styles.actions} delay={1} y={20} immediate>
          <a href={whatsappHref} className={styles.btnGhost} onClick={() => trackWhatsapp({ placement: 'hero' })}>
            WhatsApp
          </a>
          <a href={telegramHref} className={styles.btnGhost} onClick={() => trackTelegram({ placement: 'hero' })}>
            Telegram
          </a>
        </Reveal>
      </div>

      <div className={styles.scroll} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>Скролл</span>
      </div>
    </section>
  );
}
