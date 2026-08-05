import { Link } from 'react-router-dom';
import { commercialPageLinks } from '../data/seo';
import Reveal from './Reveal';
import styles from './CommercialLinks.module.css';

export default function CommercialLinks() {
  return (
    <section className={styles.section} aria-labelledby="commercial-links-heading">
      <div className={styles.inner}>
        <Reveal y={24}>
          <p className={styles.label}>Полезные страницы</p>
          <h2 className={styles.title} id="commercial-links-heading">
            Выберите сценарий проживания
          </h2>
        </Reveal>
        <div className={styles.links}>
          {commercialPageLinks.map((link, index) => (
            <Reveal key={link.to} y={24} delay={0.08 * index}>
              <Link to={link.to} className={styles.link}>
                <span>{link.label}</span>
                <small>{link.description}</small>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
