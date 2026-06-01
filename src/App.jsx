import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apartments-vladikavkaz" element={<SeoPage />} />
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
      <SkipLink />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <CookieConsent />
      <YandexMetrika />
    </BrowserRouter>
  );
}
