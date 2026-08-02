import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import SkipLink from './components/SkipLink';
import YandexMetrika from './components/YandexMetrika';
import Home from './pages/Home';
import LegalPage from './pages/LegalPage';
import SeoPage from './pages/SeoPage';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import GuestGuide from './pages/GuestGuide';
import NotFound from './pages/NotFound';

function LegacyHashRedirect() {
  useEffect(() => {
    const stripStrayHash = () => {
      const { hash, search } = window.location;
      if (!hash.startsWith('#/')) return;

      const path = hash.slice(1) || '/';
      window.history.replaceState(null, '', `${path}${search}`);
    };

    stripStrayHash();

    // The embedded HomeReserve booking widget (homereserve.ru/widget.js) runs
    // in this same document (not an iframe) and calls its own router's
    // history.replaceState(..., '#/') once it finishes initializing — which
    // happens asynchronously, after this effect's mount-time check already
    // ran. Poll instead of a single check so it gets cleaned up whenever it
    // actually appears.
    const interval = window.setInterval(stripStrayHash, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return null;
}

const BOOKING_DATE_PARAMS = ['begin_date', 'end_date'];

const normalizeBookingUrl = (value) => {
  if (value == null || typeof window === 'undefined') return value;

  const raw = String(value);
  const isAbsolute = /^[a-z][a-z\d+.-]*:\/\//i.test(raw);
  const url = new URL(raw, window.location.href);
  const cleanSearch = url.search.slice(1).replace(/\?/g, '&');
  const params = new URLSearchParams(cleanSearch);

  for (const name of BOOKING_DATE_PARAMS) {
    const values = params.getAll(name).filter(Boolean);
    params.delete(name);
    if (values.length) params.set(name, values[values.length - 1]);
  }

  const nextSearch = params.toString();
  url.search = nextSearch ? `?${nextSearch}` : '';

  if (isAbsolute) return url.href;
  return `${url.pathname}${url.search}${url.hash}`;
};

const differsOnlyByBookingDates = (currentUrl, nextUrl) => {
  if (currentUrl.pathname !== nextUrl.pathname) return false;

  const current = new URLSearchParams(currentUrl.search);
  const next = new URLSearchParams(nextUrl.search);

  for (const name of BOOKING_DATE_PARAMS) {
    current.delete(name);
    next.delete(name);
  }

  return current.toString() === next.toString();
};

function BookingHistoryGuard() {
  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    window.history.replaceState = (state, unused, url) => (
      originalReplaceState(state, unused, normalizeBookingUrl(url))
    );

    window.history.pushState = (state, unused, url) => {
      const normalized = normalizeBookingUrl(url);

      if (normalized != null) {
        const currentUrl = new URL(window.location.href);
        const nextUrl = new URL(String(normalized), window.location.href);

        if (differsOnlyByBookingDates(currentUrl, nextUrl)) {
          return originalReplaceState(state, unused, normalized);
        }
      }

      return originalPushState(state, unused, normalized);
    };

    const normalizedCurrent = normalizeBookingUrl(window.location.href);
    if (normalizedCurrent !== window.location.href) {
      originalReplaceState(window.history.state, '', normalizedCurrent);
    }

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return null;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if ((location.hash && !location.hash.startsWith('#/')) || location.state?.scrollTo) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  }, [location.hash, location.key, location.pathname, location.state]);

  return null;
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kvartira-posutochno-vladikavkaz-center" element={<SeoPage />} />
      <Route path="/komandirovka-vladikavkaz" element={<SeoPage />} />
      <Route path="/bez-posrednikov" element={<SeoPage />} />
      <Route path="/faq" element={<SeoPage />} />
      <Route path="/search" element={<Home runtimeBookingRoute />} />
      <Route path="/search/*" element={<Home runtimeBookingRoute />} />
      <Route path="/detail/*" element={<Home runtimeBookingRoute />} />
      {/* Consolidated 11 -> 5 SEO pages (2026-08). Real 301s live in nginx
          (scripts/server-bootstrap.sh); these are a client-side safety net
          for anyone landing here before that config is deployed. */}
      <Route path="/apartments-vladikavkaz" element={<Navigate to="/" replace />} />
      <Route path="/kvartira-posutochno-vladikavkaz" element={<Navigate to="/" replace />} />
      <Route path="/snyat-kvartiru-posutochno-vladikavkaz" element={<Navigate to="/" replace />} />
      <Route path="/kvartira-na-sutki-vladikavkaz" element={<Navigate to="/" replace />} />
      <Route path="/family-apartment" element={<Navigate to="/" replace />} />
      <Route path="/weekend-vladikavkaz" element={<Navigate to="/" replace />} />
      <Route path="/tourism-vladikavkaz" element={<Navigate to="/" replace />} />
      <Route path="/center-vladikavkaz" element={<Navigate to="/kvartira-posutochno-vladikavkaz-center" replace />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/rules" element={<LegalPage type="rules" />} />
      <Route path="/guest-guide" element={<GuestGuide />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/consent" element={<LegalPage type="consent" />} />
      <Route path="/cookies" element={<LegalPage type="cookies" />} />
      <Route path="/agreement" element={<LegalPage type="agreement" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BookingHistoryGuard />
      <LegacyHashRedirect />
      <ScrollToTop />
      <SkipLink />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <CookieConsent />
      <YandexMetrika />
    </BrowserRouter>
  );
}
