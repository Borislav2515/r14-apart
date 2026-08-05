import { Link } from 'react-router-dom';
import { APARTMENT, REVIEW_PLATFORMS } from '../data/apartment';
import { commercialPageLinks, legalPageLinks } from '../data/seo';
import { useSectionNavigation, isPlainLeftClick } from '../hooks/useSectionNavigation';
import { phoneDisplay, phoneHref, trackPhone, trackTelegram, trackWhatsapp, telegramHref, whatsappHref } from '../utils/analytics';
import styles from './Footer.module.css';

export default function Footer() {
  const goToSection = useSectionNavigation();

  const handleSectionLink = (e, id) => {
    if (!isPlainLeftClick(e)) return;
    e.preventDefault();
    goToSection(id);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>R14<span>·</span>APART</Link>
          <p>Двухуровневые апартаменты посуточно в историческом центре Владикавказа. Умный дом, бесконтактное заселение 24/7 и онлайн-бронирование.</p>
        </div>

        <div className={styles.col}>
          <h3>Апартаменты</h3>
          <ul>
            <li><a href="/#about" onClick={e => handleSectionLink(e, 'about')}>Об апартаментах и фотогалерея</a></li>
            <li><a href="/#features" onClick={e => handleSectionLink(e, 'features')}>Удобства</a></li>
            <li><a href="/#reviews" onClick={e => handleSectionLink(e, 'reviews')}>Отзывы</a></li>
            <li><Link to="/blog/">Блог</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>Информация</h3>
          <ul>
            <li><a href="/#faq" onClick={e => handleSectionLink(e, 'faq')}>Вопросы и ответы</a></li>
            <li><a href="/#features" onClick={e => handleSectionLink(e, 'features')}>Условия аренды</a></li>
            <li><Link to="/rules/">Правила дома</Link></li>
            {commercialPageLinks.map((link) => (
              <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
            ))}
            {legalPageLinks.map((link) => (
              <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3>Контакты</h3>
          <ul>
            <li><a href={phoneHref} onClick={() => trackPhone({ placement: 'footer' })}>{phoneDisplay}</a></li>
            <li><a href={`mailto:${APARTMENT.email}`}>{APARTMENT.email}</a></li>
            <li><span className={styles.address}>{APARTMENT.address}</span></li>
            <li><a href={telegramHref} onClick={() => trackTelegram({ placement: 'footer' })}>Telegram</a></li>
            <li><a href={whatsappHref} onClick={() => trackWhatsapp({ placement: 'footer' })}>WhatsApp</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>Отзывы на площадках</h3>
          <ul>
            {REVIEW_PLATFORMS.map((platform) => (
              <li key={platform.name}>
                <a href={platform.href} target="_blank" rel="noopener noreferrer">{platform.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} R14-APART. Все права защищены.</p>
        <p>Апартаменты посуточно во Владикавказе, ул. Революции 14</p>
      </div>
    </footer>
  );
}
