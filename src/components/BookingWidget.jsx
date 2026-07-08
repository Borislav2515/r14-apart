import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBookingModal } from '../context/BookingModalContext';
import { telegramHref, whatsappHref, trackTelegram, trackWhatsapp } from '../utils/analytics';
import styles from './BookingWidget.module.css';

const SCRIPT_SRC = 'https://homereserve.ru/widget.js';
const MAX_RETRIES = 20;
const RETRY_DELAY = 250;

function WidgetFrame() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let stopped = false;
    let retries = 0;
    let scriptRequested = false;

    const initWidget = () => {
      const container = document.getElementById('hr-widget');
      if (stopped || !container || !window.homereserve?.initWidgetSearch) return false;
      window.homereserve.initWidgetSearch({ token: 'lJ9CQtdlv9' });
      setStatus('ready');
      return true;
    };

    const tryInit = () => {
      if (stopped) return;
      if (initWidget()) return;
      retries += 1;
      if (retries < MAX_RETRIES) {
        setTimeout(tryInit, RETRY_DELAY);
      } else {
        setStatus('error');
      }
    };

    const onError = () => {
      if (!stopped) setStatus('error');
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
        script.addEventListener('error', onError, { once: true });
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', onLoad, { once: true });
        script.addEventListener('error', onError, { once: true });
        setTimeout(tryInit, RETRY_DELAY);
      }
    };

    loadScript();

    return () => {
      stopped = true;
      const script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className={styles.frame}>
      <div id="hr-widget" aria-label="Форма бронирования" hidden={status !== 'ready'} />

      {status === 'loading' && (
        <div className={styles.status} role="status" aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <span>Загружаем форму бронирования…</span>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.status} role="alert">
          <p className={styles.statusText}>Не удалось загрузить форму бронирования. Напишите нам — оформим бронь вручную:</p>
          <div className={styles.statusActions}>
            <a href={whatsappHref} className={styles.statusLink} onClick={trackWhatsapp}>WhatsApp</a>
            <a href={telegramHref} className={styles.statusLink} onClick={trackTelegram}>Telegram</a>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Renders exactly one real widget instance for the whole page lifetime and
 * portals it into whichever slot (hero or booking modal) is currently active,
 * so the third-party script never gets a second container to fight over.
 */
export default function BookingWidget() {
  const { isOpen, heroSlot, modalSlot } = useBookingModal();
  const target = isOpen ? modalSlot : heroSlot;

  if (!target) return null;

  return createPortal(<WidgetFrame />, target);
}
