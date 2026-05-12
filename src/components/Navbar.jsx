import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APARTMENT } from '../data/apartment';
import { useSectionNavigation } from '../hooks/useSectionNavigation';
import styles from './Navbar.module.css';

const LINKS = [
  { id: 'about', label: 'Апартаменты' },
  { id: 'features', label: 'Удобства' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const goToSection = useSectionNavigation();

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

  const handleSectionLink = (e, id) => {
    e.preventDefault();
    setOpen(false);
    goToSection(id);
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Основная навигация">
        <Link to="/" className={styles.logo} aria-label="R14-APART — главная">
          R14<span>·</span>APART
        </Link>

        <ul className={styles.links}>
          {LINKS.map(link => (
            <li key={link.id}>
              <a href="/" onClick={e => handleSectionLink(e, link.id)} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`tel:${APARTMENT.phone}`} className={styles.link}>{APARTMENT.phone}</a>
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

      {open && (
        <div
          id="mobileMenu"
          className={styles.mobileMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Меню навигации"
        >
          <button
            className={styles.mobileClose}
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
          >
            Закрыть
          </button>
          {LINKS.map((link, i) => (
            <a
              key={link.id}
              href="/"
              onClick={e => handleSectionLink(e, link.id)}
              className={styles.mobileLink}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`tel:${APARTMENT.phone}`}
            className={styles.mobileLink}
            style={{ transitionDelay: `${LINKS.length * 40}ms` }}
          >
            {APARTMENT.phone}
          </a>
          <p className={styles.mobileSub}>
            R14-APART · Онлайн-бронирование
          </p>
        </div>
      )}
    </>
  );
}
