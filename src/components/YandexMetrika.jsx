import { useEffect } from 'react';

const COUNTER_ID = 109137147;
const CONSENT_KEY = 'r14apart-cookie-consent';
const SCRIPT_ID = 'yandex-metrika-script';
const UTM_KEY = 'r14apart-utm';

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

const saveUtm = () => {
  const params = new URLSearchParams(window.location.search);
  const utm = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });

  if (Object.keys(utm).length > 0) {
    localStorage.setItem(UTM_KEY, JSON.stringify({ ...utm, capturedAt: new Date().toISOString() }));
  }
};

const reachGoal = (goal, params) => {
  if (window.ym) {
    window.ym(COUNTER_ID, 'reachGoal', goal, params);
  }
};

const setupGoals = () => {
  const sent = { scroll_50: false, scroll_90: false };

  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const progress = window.scrollY / maxScroll;

    if (!sent.scroll_50 && progress >= 0.5) {
      sent.scroll_50 = true;
      reachGoal('scroll_50');
    }

    if (!sent.scroll_90 && progress >= 0.9) {
      sent.scroll_90 = true;
      reachGoal('scroll_90');
      window.removeEventListener('scroll', onScroll);
    }
  };

  const onBookingClick = (event) => {
    const widget = document.getElementById('hr-widget');
    if (!widget || !widget.contains(event.target)) return;
    const clickable = event.target.closest('button, a, input[type="submit"]');
    if (!clickable) return;

    const text = `${clickable.textContent ?? ''} ${clickable.value ?? ''}`.toLowerCase();
    if (text.includes('заброн') || text.includes('оплат') || text.includes('submit')) {
      reachGoal('booking_submit');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', onBookingClick, true);

  return () => {
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('click', onBookingClick, true);
  };
};

export default function YandexMetrika() {
  useEffect(() => {
    saveUtm();
    loadMetrika();
    window.addEventListener('r14apart-cookie-consent', loadMetrika);
    return () => window.removeEventListener('r14apart-cookie-consent', loadMetrika);
  }, []);

  useEffect(() => setupGoals(), []);

  return null;
}
