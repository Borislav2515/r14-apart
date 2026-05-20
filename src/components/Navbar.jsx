import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APARTMENT } from '../data/apartment';
import { useSectionNavigation } from '../hooks/useSectionNavigation';
import styles from './Navbar.module.css';

const LINKS = [
  { id: 'about', label: 'Апартаменты', meta: 'Два уровня, 45 м²' },
  { id: 'features', label: 'Удобства', meta: 'Умный дом и комфорт' },
  { id: 'reviews', label: 'Отзывы', meta: '5.0 от гостей' },
  { id: 'faq', label: 'FAQ', meta: 'Правила и заселение' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
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
    const scrollY = window.scrollY;

    if (open) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';

      if (open) {
        window.scrollTo(0, scrollY);
      }
    };
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
    window.setTimeout(() => goToSection(id), 0);
  };

  const handleMenuPointer = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--pointer-x', `${e.clientX - bounds.left}px`);
    e.currentTarget.style.setProperty('--pointer-y', `${e.clientY - bounds.top}px`);
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
          <span className={styles.burgerAura} aria-hidden="true" />
          <span />
          <span />
          <span />
        </button>
      </nav>

      {open && (
        <div
          id="mobileMenu"
          className={styles.mobileMenu}
          onPointerMove={handleMenuPointer}
          role="dialog"
          aria-modal="true"
          aria-label="Меню навигации"
        >
          <div className={styles.mobileHalo} aria-hidden="true" />
          <div className={styles.mobileTopline} aria-hidden="true">
            <span>R14</span>
            <span>Владикавказ</span>
          </div>
          <button
            className={styles.mobileClose}
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
          >
            <span />
            <span />
          </button>
          <div className={styles.mobileInner}>
            <div className={styles.mobileIntro} aria-hidden="true">
              <span>Навигация</span>
              <strong>{String(activeItem + 1).padStart(2, '0')}</strong>
            </div>
            <div className={styles.mobileLinks}>
              {LINKS.map((link, i) => (
                <a
                  key={link.id}
                  href="/"
                  onClick={e => handleSectionLink(e, link.id)}
                  className={styles.mobileLink}
                  onPointerEnter={() => setActiveItem(i)}
                  onFocus={() => setActiveItem(i)}
                  style={{ '--item-index': i }}
                >
                  <span className={styles.mobileIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.mobileText}>
                    <span className={styles.mobileLabel}>{link.label}</span>
                    <span className={styles.mobileMeta}>{link.meta}</span>
                  </span>
                  <span className={styles.mobileArrow} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className={styles.mobileBottom}>
            <Link to="/" className={styles.mobileLogo} onClick={() => setOpen(false)} aria-label="R14-APART — главная">
              R14<span>·</span>APART
            </Link>
            <div className={styles.mobileActions}>
              <a href={`tel:${APARTMENT.phone}`} className={styles.mobileCall} onClick={() => setOpen(false)}>
                +7 906 033 00 14
              </a>
              <a href={`mailto:${APARTMENT.email}`} className={styles.mobileMail} onClick={() => setOpen(false)}>
                Написать
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
