import { Link, useParams } from 'react-router-dom';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import StructuredData from '../components/StructuredData';
import ResponsivePicture from '../components/ResponsivePicture';
import { APARTMENT } from '../data/apartment';
import { blogPosts, getPostBySlug, seoDefaults } from '../data/seo';
import usePageMeta from '../hooks/usePageMeta';
import { trackBookingOpen } from '../utils/analytics';
import styles from './SeoPage.module.css';

export default function BlogPost() {
  const { slug = '' } = useParams();
  const post = getPostBySlug(slug) ?? blogPosts[0];
  const crumbs = [
    { label: 'Главная', to: '/' },
    { label: 'Блог', to: '/blog' },
    { label: post.h1, to: post.path },
  ];

  usePageMeta({
    title: post.title,
    description: post.description,
    path: post.path,
    type: 'article',
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.h1,
    description: post.description,
    image: seoDefaults.image,
    datePublished: seoDefaults.updatedAt,
    dateModified: seoDefaults.updatedAt,
    author: {
      '@type': 'Organization',
      name: APARTMENT.name,
    },
    publisher: {
      '@type': 'Organization',
      name: APARTMENT.name,
    },
    mainEntityOfPage: `${seoDefaults.siteUrl}${post.path}`,
  };

  return (
    <main className={styles.page}>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema(crumbs)} />
      <section className={styles.hero}>
        <ResponsivePicture
          image={APARTMENT.images.bedroom}
          alt=""
          className={styles.heroImg}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
        <div className={styles.heroInner}>
          <Breadcrumbs items={crumbs} />
          <p className={styles.eyebrow}>Блог R14-APART</p>
          <h1 className={styles.title}>{post.h1}</h1>
          <p className={styles.lead}>{post.excerpt}</p>
          <div className={styles.actions}>
            <Link to="/" state={{ scrollTo: 'hero' }} className={styles.primary} onClick={trackBookingOpen}>
              Забронировать апартаменты
            </Link>
            <Link to="/blog" className={styles.secondary}>
              Все статьи
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.grid}>
          <article className={styles.sections}>
            {post.sections.map(([title, text]) => (
              <section key={title} className={styles.section}>
                <h2>{title}</h2>
                <p>{text}</p>
              </section>
            ))}
          </article>
          <aside className={styles.aside}>
            <strong>R14-APART</strong>
            <p>
              Апартаменты в центре Владикавказа для туристов, семейных поездок и маршрутов по Северной Осетии.
            </p>
            <Link to="/" state={{ scrollTo: 'hero' }} className={styles.primary} onClick={trackBookingOpen}>
              Проверить даты
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
