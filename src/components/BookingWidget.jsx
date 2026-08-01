import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBookingModal } from '../context/BookingModalContext';
import {
  phoneHref,
  telegramHref,
  whatsappHref,
  trackPhone,
  trackTelegram,
  trackWhatsapp,
  trackWidgetError,
  trackWidgetLoaded,
} from '../utils/analytics';
import styles from './BookingWidget.module.css';

const SCRIPT_SRC = 'https://homereserve.ru/widget.js';
const FALLBACK_TIMEOUT = 4000;
const RETRY_DELAY = 250;

function WidgetFrame() {
  const [status, setStatus] = useState('loading');
  const [errorType, setErrorType] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let stopped = false;
    let failed = false;
    let scriptRequested = false;
    let retryTimer = 0;
    const startedAt = performance.now();

    const loadMs = () => Math.round(performance.now() - startedAt);

    const fail = (type) => {
      if (stopped || failed) return;
      failed = true;
      window.clearTimeout(retryTimer);
      setErrorType(type);
      setStatus('error');
      trackWidgetError({ error_type: type, load_ms: loadMs() });
    };

    const initWidget = () => {
      const container = document.getElementById('hr-widget');
      if (stopped || failed || !container || !window.homereserve?.initWidgetSearch) return false;
      window.homereserve.initWidgetSearch({ token: 'lJ9CQtdlv9' });
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(retryTimer);
      setStatus('ready');
      trackWidgetLoaded({ load_ms: loadMs() });
      return true;
    };

    const tryInit = () => {
      if (stopped || failed) return;
      if (initWidget()) return;
      retryTimer = window.setTimeout(tryInit, RETRY_DELAY);
    };

    const onError = (event) => {
      event.currentTarget.dataset.hrError = 'true';
      fail('script_error');
    };

    const fallbackTimer = window.setTimeout(() => fail('timeout'), FALLBACK_TIMEOUT);

    if (window.homereserve?.initWidgetSearch) {
      tryInit();
      return () => {
        stopped = true;
        window.clearTimeout(fallbackTimer);
        window.clearTimeout(retryTimer);
      };
    }

    const onLoad = () => tryInit();

    const loadScript = () => {
      if (stopped || scriptRequested) return;
      scriptRequested = true;

      let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);

      if (script?.dataset.hrError === 'true') {
        script.remove();
        script = null;
      }

      if (!script) {
        script = document.createElement('script');
        script.type = 'module';
        script.src = SCRIPT_SRC;
        script.async = true;
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
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(retryTimer);
      const script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
    };
  }, [reloadKey]);

  const retry = () => {
    setErrorType('');
    setStatus('loading');
    setReloadKey((key) => key + 1);
  };

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
          <p className={styles.statusText}>
            Форма бронирования сейчас не загрузилась. Попробуйте ещё раз или напишите нам — быстро проверим даты вручную.
          </p>
          {errorType && <span className={styles.statusMeta}>Ошибка: {errorType}</span>}
          <div className={styles.statusActions}>
            <button type="button" className={styles.statusButton} onClick={retry}>Повторить</button>
            <a href={whatsappHref} className={styles.statusLink} onClick={() => trackWhatsapp({ placement: 'widget_fallback' })}>WhatsApp</a>
            <a href={phoneHref} className={styles.statusLink} onClick={() => trackPhone({ placement: 'widget_fallback' })}>Позвонить</a>
            <a href={telegramHref} className={styles.statusLink} onClick={() => trackTelegram({ placement: 'widget_fallback' })}>Telegram</a>
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
