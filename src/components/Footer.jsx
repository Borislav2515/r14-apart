import { Link } from 'react-router-dom';
import { APARTMENT } from '../data/apartment';
import { useSectionNavigation } from '../hooks/useSectionNavigation';
import styles from './Footer.module.css';

export default function Footer() {
  const goToSection = useSectionNavigation();

  const handleSectionLink = (e, id) => {
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
          <h4>Апартаменты</h4>
          <ul>
            <li><a href="/" onClick={e => handleSectionLink(e, 'about')}>Об апартаментах</a></li>
            <li><a href="/" onClick={e => handleSectionLink(e, 'features')}>Удобства</a></li>
            <li><a href="/" onClick={e => handleSectionLink(e, 'gallery')}>Фотогалерея</a></li>
            <li><a href="/" onClick={e => handleSectionLink(e, 'reviews')}>Отзывы</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Информация</h4>
          <ul>
            <li><a href="/" onClick={e => handleSectionLink(e, 'faq')}>Вопросы и ответы</a></li>
            <li><a href="/" onClick={e => handleSectionLink(e, 'features')}>Условия аренды</a></li>
            <li><Link to="/rules">Правила дома</Link></li>
            <li><Link to="/privacy">Конфиденциальность</Link></li>
            <li><Link to="/consent">Согласие на обработку</Link></li>
            <li><Link to="/cookies">Политика cookie</Link></li>
            <li><Link to="/agreement">Пользовательское соглашение</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Контакты</h4>
          <ul>
            <li><a href={`tel:${APARTMENT.phone}`}>{APARTMENT.phone}</a></li>
            <li><a href={`mailto:${APARTMENT.email}`}>{APARTMENT.email}</a></li>
            <li><span className={styles.address}>{APARTMENT.address}</span></li>
            <li><a href="https://t.me/r14_apart">Telegram</a></li>
            <li><a href="https://wa.me/89060330014">WhatsApp</a></li>
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
