import { APARTMENT } from '../data/apartment';

const COUNTER_ID = 109137147;

const getDeviceType = () => {
  if (typeof window === 'undefined') return 'unknown';
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768 ? 'mobile' : 'desktop';
};

const getReferrerDomain = () => {
  if (typeof document === 'undefined' || !document.referrer) return '';
  try {
    return new URL(document.referrer).hostname;
  } catch {
    return '';
  }
};

const getConsentState = () => {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const raw = window.localStorage.getItem('r14apart-cookie-consent');
    if (!raw) return 'unset';
    const parsed = JSON.parse(raw);
    if (parsed.analytics) return 'analytics';
    return 'necessary';
  } catch {
    return 'unknown';
  }
};

const baseParams = () => ({
  event_time: new Date().toISOString(),
  source_page: typeof window === 'undefined' ? '' : window.location.pathname,
  referrer_domain: getReferrerDomain(),
  device_type: getDeviceType(),
  consent_state: getConsentState(),
});

export const reachGoal = (goal, params = {}) => {
  if (typeof window === 'undefined' || !window.ym) return;
  window.ym(COUNTER_ID, 'reachGoal', goal, { ...baseParams(), ...params });
};

export const phoneNumber = APARTMENT.phone.replace(/\D/g, '');
export const phoneHref = `tel:+${phoneNumber}`;
export const phoneDisplay = APARTMENT.phoneDisplay || `+${phoneNumber}`;
export const whatsappHref = `https://wa.me/${phoneNumber}`;
export const telegramHref = 'https://t.me/r14_apart';

export const trackPhone = (params) => reachGoal('click_phone', params);
export const trackWhatsapp = (params) => reachGoal('click_whatsapp', params);
export const trackTelegram = (params) => reachGoal('click_telegram', params);
export const trackBookingOpen = (params) => reachGoal('booking_open', params);
export const trackWidgetLoaded = (params) => reachGoal('widget_loaded', params);
export const trackWidgetError = (params) => reachGoal('widget_error', params);
export const trackGalleryOpen = () => reachGoal('gallery_open');
export const trackMap = () => reachGoal('track_map');
export const trackRoute = () => reachGoal('track_route');
