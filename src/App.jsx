import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

function LegacyHashRedirect() {
  useEffect(() => {
    const { hash, origin } = window.location;
    if (!hash.startsWith('#/')) return;

    const path = hash.slice(1) || '/';
    window.history.replaceState(null, '', `${origin}${path}`);
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
    if (location.hash || location.state?.scrollTo) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  }, [location.hash, location.key, location.pathname, location.state]);

  return null;
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apartments-vladikavkaz" element={<SeoPage />} />
      <Route path="/kvartira-posutochno-vladikavkaz" element={<SeoPage />} />
      <Route path="/snyat-kvartiru-posutochno-vladikavkaz" element={<SeoPage />} />
      <Route path="/kvartira-na-sutki-vladikavkaz" element={<SeoPage />} />
      <Route path="/kvartira-posutochno-vladikavkaz-center" element={<SeoPage />} />
      <Route path="/komandirovka-vladikavkaz" element={<SeoPage />} />
      <Route path="/bez-posrednikov" element={<SeoPage />} />
      <Route path="/center-vladikavkaz" element={<SeoPage />} />
      <Route path="/family-apartment" element={<SeoPage />} />
      <Route path="/weekend-vladikavkaz" element={<SeoPage />} />
      <Route path="/tourism-vladikavkaz" element={<SeoPage />} />
      <Route path="/faq" element={<SeoPage />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/rules" element={<LegalPage type="rules" />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/consent" element={<LegalPage type="consent" />} />
      <Route path="/cookies" element={<LegalPage type="cookies" />} />
      <Route path="/agreement" element={<LegalPage type="agreement" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
