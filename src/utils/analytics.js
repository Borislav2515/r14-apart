import { APARTMENT } from '../data/apartment';

const COUNTER_ID = 109137147;

export const reachGoal = (goal, params = {}) => {
  if (typeof window === 'undefined' || !window.ym) return;
  window.ym(COUNTER_ID, 'reachGoal', goal, params);
};

export const phoneHref = `tel:${APARTMENT.phone.replace(/\D/g, '')}`;
export const whatsappHref = `https://wa.me/${APARTMENT.phone.replace(/\D/g, '')}`;
export const telegramHref = 'https://t.me/r14_apart';

export const trackPhone = () => reachGoal('click_phone');
export const trackWhatsapp = () => reachGoal('click_whatsapp');
export const trackTelegram = () => reachGoal('click_telegram');
export const trackBookingOpen = () => reachGoal('booking_open');
export const trackGalleryOpen = () => reachGoal('gallery_open');
export const trackMap = () => reachGoal('track_map');
export const trackRoute = () => reachGoal('track_route');

