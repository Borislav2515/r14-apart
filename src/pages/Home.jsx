import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import FaqSection from '../components/FaqSection';
import Cta from '../components/Cta';

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
      <About />
      <Gallery />
      <Features />
      <Reviews />
      <FaqSection />
      <Cta />
    </motion.main>
  );
}
