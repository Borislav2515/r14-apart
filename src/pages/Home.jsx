import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';

const About = lazy(() => import('../components/About'));
const Gallery = lazy(() => import('../components/Gallery'));
const Features = lazy(() => import('../components/Features'));
const Reviews = lazy(() => import('../components/Reviews'));
const FaqSection = lazy(() => import('../components/FaqSection'));
const Cta = lazy(() => import('../components/Cta'));

function DeferredSection({ minHeight = 320, children }) {
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
      { rootMargin: '500px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={holderRef} style={{ minHeight }}>
      {shouldRender ? <Suspense fallback={null}>{children}</Suspense> : null}
    </section>
  );
}

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <StatsBar />
      <DeferredSection minHeight={420}>
        <About />
      </DeferredSection>
      <DeferredSection minHeight={420}>
        <Gallery />
      </DeferredSection>
      <DeferredSection minHeight={420}>
        <Features />
      </DeferredSection>
      <DeferredSection minHeight={420}>
        <Reviews />
      </DeferredSection>
      <DeferredSection minHeight={320}>
        <FaqSection />
      </DeferredSection>
      <DeferredSection minHeight={360}>
        <Cta />
      </DeferredSection>
    </motion.main>
  );
}
