import { useEffect, useRef } from 'react';
import { APARTMENT } from '../data/apartment';
import { trackBookingOpen, trackTelegram, trackWhatsapp, telegramHref, whatsappHref } from '../utils/analytics';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './Hero.module.css';

const SCRIPT_SRC = 'https://homereserve.ru/widget.js';
const LOAD_BOOKING_WIDGET_EVENT = 'r14apart-load-booking-widget';

const requestBookingWidget = () => {
  window.dispatchEvent(new Event(LOAD_BOOKING_WIDGET_EVENT));
};

export default function Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);

  // Parallax on scroll
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotion.matches) {
      if (bgRef.current) bgRef.current.style.transform = 'translate3d(0, 0, 0) scale(1.04)';
      return undefined;
    }

    const mobileViewport = window.matchMedia('(max-width: 768px)');
    let frameId = 0;
    let current = 0;
    let target = 0;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const measure = () => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const factor = mobileViewport.matches ? 0.14 : 0.28;
      const maxOffset = viewportHeight * (mobileViewport.matches ? 0.12 : 0.24);

      target = rect.bottom > 0 && rect.top < viewportHeight
        ? clamp(-rect.top * factor, 0, maxOffset)
        : 0;
    };

    const render = () => {
      if (!bgRef.current) return;

      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.08) current = target;

      bgRef.current.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0) scale(1.04)`;

      if (current !== target) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    };

    const update = () => {
      measure();
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

  // HomeReserve widget init in hero (#hr-widget)
  useEffect(() => {
    let stopped = false;
    let retries = 0;
    let scriptRequested = false;
    let idleId;
    let timerId;

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

    const onLoad = () => tryInit();

    const loadScript = () => {
      if (stopped || scriptRequested) return;
      scriptRequested = true;

      let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);

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
    };

    window.addEventListener(LOAD_BOOKING_WIDGET_EVENT, loadScript);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadScript, { timeout: 3500 });
    } else {
      timerId = window.setTimeout(loadScript, 2400);
    }

    return () => {
      stopped = true;
      window.removeEventListener(LOAD_BOOKING_WIDGET_EVENT, loadScript);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timerId) window.clearTimeout(timerId);
      document.querySelector(`script[src="${SCRIPT_SRC}"]`)?.removeEventListener('load', onLoad);
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
          R14<span className={styles.dot}>·</span>
          <br />
          <em>APART</em>
        </Reveal>

        <Reveal as="p" className={styles.subtitle} delay={0.8} y={24} immediate>
          Квартира посуточно во Владикавказе: ул. Революции, 14. Двухуровневые апартаменты в центре, умный дом, бесконтактное заселение 24/7 по паролю и прямое бронирование.
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
          <a
            href="#hr-widget"
            className={styles.btnPrimary}
            onClick={() => {
              requestBookingWidget();
              trackBookingOpen();
            }}
            onFocus={requestBookingWidget}
            onMouseEnter={requestBookingWidget}
          >
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
