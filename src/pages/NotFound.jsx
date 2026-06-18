import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import styles from './LegalPage.module.css';

export default function NotFound() {
  usePageMeta({
    title: 'Страница не найдена | R14-APART',
    description: 'Такой страницы на сайте R14-APART нет. Можно вернуться на главную, открыть блог или проверить даты для бронирования.',
    path: '/404',
    robots: 'noindex, nofollow',
  });

  return (
    <main className={`${styles.page} ${styles.notFoundPage}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.back}>На главную</Link>
        <p className={styles.eyebrow}>404</p>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.lead}>
          Возможно, ссылка устарела или адрес набран с ошибкой. Апартаменты R14-APART на месте: можно вернуться к бронированию или почитать гиды по Владикавказу и Северной Осетии.
        </p>

        <div className={styles.notFoundActions}>
          <Link to="/" state={{ scrollTo: 'hero' }} className={styles.primaryAction}>
            Проверить даты
          </Link>
          <Link to="/blog" className={styles.secondaryAction}>
            Открыть блог
          </Link>
          <Link to="/apartments-vladikavkaz" className={styles.secondaryAction}>
            Об апартаментах
          </Link>
        </div>
      </div>
    </main>
  );
}
