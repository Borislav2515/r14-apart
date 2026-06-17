import { Link, useParams } from 'react-router-dom';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import StructuredData from '../components/StructuredData';
import ResponsivePicture from '../components/ResponsivePicture';
import { APARTMENT } from '../data/apartment';
import { blogPosts, getPostBySlug, seoDefaults } from '../data/seo';
import usePageMeta from '../hooks/usePageMeta';
import { trackBookingOpen } from '../utils/analytics';
import styles from './SeoPage.module.css';

function RichBlocks({ blocks }) {
  return blocks.map((block) => {
    if (block.type === 'photo') {
      return (
        <figure key={block.title} className={styles.photoPlaceholder}>
          <div className={styles.photoFrame}>
            <span>{block.title}</span>
            <small>{block.fileHint}</small>
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    }

    if (block.type === 'heading') {
      return (
        <section key={block.title} className={styles.section}>
          <h2>{block.title}</h2>
          {block.texts?.map((text) => <p key={text}>{text}</p>)}
          {block.list && (
            <ul>
              {block.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      );
    }

    if (block.type === 'links') {
      return (
        <section key={block.title} className={styles.section}>
          <h2>{block.title}</h2>
          <div className={styles.inlineLinks}>
            {block.items.map((item) => (
              <Link key={item.to} to={item.to}>{item.label}</Link>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === 'faq') {
      return (
        <section key={block.title} className={styles.section}>
          <h2>{block.title}</h2>
          <div className={styles.articleFaq}>
            {block.items.map((item) => (
              <article key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === 'table') {
      return (
        <section key={block.title} className={styles.section}>
          <h2>{block.title}</h2>
          <div className={styles.tableWrap}>
            <table className={styles.articleTable}>
              <thead>
                <tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join('-')}>
                    {row.map((cell) => <td key={cell}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (block.type === 'cta') {
      return (
        <section key={block.text} className={styles.section}>
          <p>{block.text}</p>
          <Link to="/" state={{ scrollTo: 'hero' }} className={styles.articleCta} onClick={trackBookingOpen}>
            Проверить даты и забронировать апартаменты
          </Link>
        </section>
      );
    }

    return (
      <section key={block.text} className={styles.section}>
        <p>{block.text}</p>
      </section>
    );
  });
}

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
  const postFaq = post.blocks?.find((block) => block.type === 'faq');
  const postFaqSchema = postFaq && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: postFaq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <main className={styles.page}>
      <StructuredData data={postFaqSchema ? [articleSchema, breadcrumbSchema(crumbs), postFaqSchema] : [articleSchema, breadcrumbSchema(crumbs)]} />
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
            {post.blocks ? (
              <RichBlocks blocks={post.blocks} />
            ) : (
              post.sections.map(([title, text]) => (
                <section key={title} className={styles.section}>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </section>
              ))
            )}
            {post.related && (
              <section className={styles.section}>
                <h2>Читайте также</h2>
                <div className={styles.inlineLinks}>
                  {post.related.map((item) => (
                    <Link key={item.to} to={item.to}>{item.label}</Link>
                  ))}
                </div>
              </section>
            )}
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
