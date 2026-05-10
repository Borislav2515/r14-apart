import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/#about', label: 'Апартаменты' },
  { to: '/#features', label: 'Удобства' },
  { to: '/#reviews', label: 'Отзывы' },
  { to: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open]);

  const handleHashLink = (e, to) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      setOpen(false);
      const id = to.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        const navOffset = 80;
        const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      else {
        window.location.href = to;
      }
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Основная навигация">
        <Link to="/" className={styles.logo} aria-label="R14-APART — главная">
          R14<span>·</span>APART
        </Link>

        <ul className={styles.links}>
          {LINKS.map(link => (
            <li key={link.to}>
              <a href={link.to} onClick={e => handleHashLink(e, link.to)} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="tel:+79991234567" className={styles.link}>+7 999 123-45-67</a>
          </li>
        </ul>

        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="mobileMenu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobileMenu"
            className={styles.mobileMenu}
            role="dialog"
            aria-modal="true"
            aria-label="Меню навигации"
            initial={{ clipPath: 'circle(0% at calc(100% - 60px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 60px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 60px) 36px)' }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
          >
            <button
              className={styles.mobileClose}
              onClick={() => setOpen(false)}
              aria-label="Закрыть меню"
            >
              Закрыть
            </button>
            {LINKS.map((link, i) => (
              <motion.a
                key={link.to}
                href={link.to}
                onClick={e => handleHashLink(e, link.to)}
                className={styles.mobileLink}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="tel:+79991234567"
              className={styles.mobileLink}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + LINKS.length * 0.08 }}
            >
              Позвонить
            </motion.a>
            <motion.p
              className={styles.mobileSub}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              R14-APART · Онлайн-бронирование
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
