import { Link } from 'react-router-dom';
import StructuredData from '../components/StructuredData';
import ResponsivePicture from '../components/ResponsivePicture';
import { APARTMENT } from '../data/apartment';
import { blogIndexMeta, blogPosts } from '../data/seo';
import usePageMeta from '../hooks/usePageMeta';
import styles from './SeoPage.module.css';

export default function BlogIndex() {
  usePageMeta({
    title: blogIndexMeta.title,
    description: blogIndexMeta.description,
    path: blogIndexMeta.path,
  });

  return (
    <main className={styles.page}>
      <StructuredData />
      <section className={styles.hero}>
        <ResponsivePicture
          image={APARTMENT.images.kitchen}
          alt=""
          className={styles.heroImg}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Блог R14-APART</p>
          <h1 className={styles.title}>Владикавказ и Северная Осетия</h1>
          <p className={styles.lead}>
            Гиды по проживанию, маршрутам выходного дня, поездкам в горы и удобной базе в центре Владикавказа.
          </p>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.cards}>
          {blogPosts.map((post) => (
            <article key={post.slug} className={styles.card}>
              <h2>{post.h1}</h2>
              <p>{post.excerpt}</p>
              <Link to={post.path}>Читать</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

