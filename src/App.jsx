import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import CookieConsent from './components/CookieConsent';
import SkipLink from './components/SkipLink';
import YandexMetrika from './components/YandexMetrika';
import Home from './pages/Home';
import LegalPage from './pages/LegalPage';

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
      <Cursor />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <CookieConsent />
      <YandexMetrika />
    </BrowserRouter>
  );
}
