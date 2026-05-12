import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import { scrollToSection } from '../hooks/useSectionNavigation';

const About = lazy(() => import('../components/About'));
const Gallery = lazy(() => import('../components/Gallery'));
const Features = lazy(() => import('../components/Features'));
const Reviews = lazy(() => import('../components/Reviews'));
const FaqSection = lazy(() => import('../components/FaqSection'));
const Cta = lazy(() => import('../components/Cta'));

function DeferredSection({ id, minHeight = 320, children }) {
  const [shouldRender, setShouldRender] = useState(false);
  const holderRef = useRef(null);

  useEffect(() => {
    const target = holderRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={holderRef} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? <Suspense fallback={null}>{children}</Suspense> : null}
    </section>
  );
}

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (!id) return undefined;

    const timer = window.setTimeout(() => {
      scrollToSection(id);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.state]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <StatsBar />
      <DeferredSection id="about" minHeight={420}>
        <About />
      </DeferredSection>
      <DeferredSection id="gallery" minHeight={420}>
        <Gallery />
      </DeferredSection>
      <DeferredSection id="features" minHeight={420}>
        <Features />
      </DeferredSection>
      <DeferredSection id="reviews" minHeight={420}>
        <Reviews />
      </DeferredSection>
      <DeferredSection id="faq" minHeight={320}>
        <FaqSection />
      </DeferredSection>
      <DeferredSection id="cta" minHeight={360}>
        <Cta />
      </DeferredSection>
    </motion.main>
  );
}
