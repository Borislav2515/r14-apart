import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import CookieConsent from './components/CookieConsent';
import SkipLink from './components/SkipLink';
import Home from './pages/Home';
import LegalPage from './pages/LegalPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<LegalPage type="rules" />} />
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/consent" element={<LegalPage type="consent" />} />
        <Route path="/cookies" element={<LegalPage type="cookies" />} />
        <Route path="/agreement" element={<LegalPage type="agreement" />} />
      </Routes>
    </AnimatePresence>
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
    </BrowserRouter>
  );
}
