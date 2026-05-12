import { useEffect } from 'react';

const COUNTER_ID = 109137147;
const CONSENT_KEY = 'r14apart-cookie-consent';
const SCRIPT_ID = 'yandex-metrika-script';

const hasAnalyticsConsent = () => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    if (raw === 'accepted') return true;
    return Boolean(JSON.parse(raw).analytics);
  } catch {
    return false;
  }
};

const loadMetrika = () => {
  if (!hasAnalyticsConsent() || window.ym) return;

  window.ym = function ymFallback() {
    window.ym.a = window.ym.a || [];
    window.ym.a.push(arguments);
  };
  window.ym.l = Number(new Date());

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`;
    document.head.appendChild(script);
  }

  window.ym(COUNTER_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
  });
};

export default function YandexMetrika() {
  useEffect(() => {
    loadMetrika();
    window.addEventListener('r14apart-cookie-consent', loadMetrika);
    return () => window.removeEventListener('r14apart-cookie-consent', loadMetrika);
  }, []);

  return null;
}
