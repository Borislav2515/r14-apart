import { useEffect, useRef } from 'react';
import { APARTMENT } from '../data/apartment';
import { trackBookingOpen, trackTelegram, trackWhatsapp, telegramHref, whatsappHref } from '../utils/analytics';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './Hero.module.css';

const SCRIPT_SRC = 'https://homereserve.ru/widget.js';

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

  // HomeReserve widget init in hero (#hr-widget)
  useEffect(() => {
    let stopped = false;
    let retries = 0;

    const initWidget = () => {
      const container = document.getElementById('hr-widget');
      if (stopped || !container || !window.homereserve?.initWidgetSearch) return false;
      window.homereserve.initWidgetSearch({ token: 'lJ9CQtdlv9', tag: 'site' });
      return true;
    };

    const tryInit = () => {
      if (stopped) return;
      if (initWidget()) return;
      retries += 1;
      if (retries < 20) setTimeout(tryInit, 250);
    };

    if (window.homereserve?.initWidgetSearch) {
      tryInit();
      return () => {
        stopped = true;
      };
    }

    let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    const onLoad = () => tryInit();

    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = SCRIPT_SRC;
      script.addEventListener('load', onLoad, { once: true });
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', onLoad, { once: true });
      setTimeout(tryInit, 250);
    }

    return () => {
      stopped = true;
      script?.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <section id="hero" className={styles.hero} aria-label="Главный экран">
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
          R14<span className={styles.dot}>·</span>
          <br />
          <em>APART</em>
        </Reveal>

        <Reveal as="p" className={styles.subtitle} delay={0.8} y={24} immediate>
          Двухуровневые апартаменты посуточно во Владикавказе: ул. Революции, 14. Умный дом, бесконтактное заселение 24/7 по паролю, тихая улица в историческом центре.
        </Reveal>

        <Reveal className={styles.facts} delay={0.9} y={20} immediate>
          <span>{APARTMENT.city}</span>
          <span>{APARTMENT.address}</span>
          <span>от {APARTMENT.priceFrom.toLocaleString('ru-RU')} ₽/сутки</span>
          <span>до {APARTMENT.guests} гостей</span>
          <span>Wi-Fi</span>
          <span>парковка</span>
          <span>самостоятельное заселение</span>
        </Reveal>

        <Reveal className={styles.actions} delay={0.96} y={20} immediate>
          <a href="#hr-widget" className={styles.btnPrimary} onClick={trackBookingOpen}>
            Бронировать
          </a>
          <a href={whatsappHref} className={styles.btnGhost} onClick={trackWhatsapp}>
            WhatsApp
          </a>
          <a href={telegramHref} className={styles.btnGhost} onClick={trackTelegram}>
            Telegram
          </a>
        </Reveal>

        <Reveal className={styles.widgetWrap} delay={1} y={24} immediate>
          <div id="hr-widget" aria-label="Форма бронирования" />
        </Reveal>
      </div>

      <div className={styles.scroll} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>Скролл</span>
      </div>
    </section>
  );
}
