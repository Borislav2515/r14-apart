import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import StructuredData from '../components/StructuredData';
import BookingWidget from '../components/BookingWidget';
import BookingModal from '../components/BookingModal';
import { BookingModalProvider } from '../context/BookingModalContext';
import usePageMeta from '../hooks/usePageMeta';
import { scrollToSection } from '../hooks/useSectionNavigation';
import { seoDefaults } from '../data/seo';

const About = lazy(() => import('../components/About'));
const Features = lazy(() => import('../components/Features'));
const Reviews = lazy(() => import('../components/Reviews'));
const FaqSection = lazy(() => import('../components/FaqSection'));
const Cta = lazy(() => import('../components/Cta'));
const MapSection = lazy(() => import('../components/MapSection'));

function HomeSection({ id, minHeight = 320, children }) {
  return (
    <section id={id}>
      <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>
        {children}
      </Suspense>
    </section>
  );
}

export default function Home() {
  const location = useLocation();

  usePageMeta({
    title: seoDefaults.home.title,
    description: seoDefaults.home.description,
    path: '/',
  });

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (!id) return undefined;

    const timer = window.setTimeout(() => {
      scrollToSection(id);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.state]);

  // Direct/shared links (e.g. /#reviews) land on the right section, offset for
  // the fixed nav — mount-only, so it doesn't refire on same-page hash updates
  // that goToSection() already scrolls for.
  useEffect(() => {
    if (!location.hash) return undefined;
    const id = location.hash.slice(1);

    const timer = window.setTimeout(() => {
      scrollToSection(id);
    }, 80);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BookingModalProvider>
      <main>
        <StructuredData />
        <Hero />
        <StatsBar />
        <HomeSection id="about" minHeight={640}>
          <About />
        </HomeSection>
        <HomeSection id="features" minHeight={420}>
          <Features />
        </HomeSection>
        <HomeSection id="reviews" minHeight={420}>
          <Reviews />
        </HomeSection>
        <HomeSection id="faq" minHeight={320}>
          <FaqSection />
        </HomeSection>
        <HomeSection id="map" minHeight={420}>
          <MapSection />
        </HomeSection>
        <HomeSection id="cta" minHeight={360}>
          <Cta />
        </HomeSection>
      </main>
      <BookingWidget />
      <BookingModal />
    </BookingModalProvider>
  );
}
