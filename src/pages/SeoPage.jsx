import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import StructuredData, { faqSchema } from '../components/StructuredData';
import ResponsivePicture from '../components/ResponsivePicture';
import { APARTMENT } from '../data/apartment';
import { faqItems, getPageBySlug, seoDefaults } from '../data/seo';
import usePageMeta from '../hooks/usePageMeta';
import { trackBookingOpen, trackWhatsapp, whatsappHref } from '../utils/analytics';
import styles from './SeoPage.module.css';

function BookingAside() {
  return (
    <aside className={styles.aside}>
      <strong>от {APARTMENT.priceFrom.toLocaleString('ru-RU')} ₽/сутки</strong>
      <p>
        {APARTMENT.address}. До {APARTMENT.guests} гостей, {APARTMENT.area} м²,
        самостоятельное заселение и онлайн-бронирование.
      </p>
      <div className={styles.actions}>
        <Link to="/" state={{ scrollTo: 'hero' }} className={styles.primary} onClick={() => trackBookingOpen({ placement: 'seo_aside' })}>
          Забронировать
        </Link>
        <a href={whatsappHref} className={styles.secondary} onClick={() => trackWhatsapp({ placement: 'seo_aside' })}>
          WhatsApp
        </a>
      </div>
    </aside>
  );
}

export default function SeoPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/+|\/+$/g, '') || 'bez-posrednikov';
  const page = getPageBySlug(slug) ?? getPageBySlug('bez-posrednikov');
  const isFaq = page.slug === 'faq';
  const crumbs = [
    { label: 'Главная', to: '/' },
    { label: page.h1, to: page.path },
  ];

  usePageMeta({
    title: page.title,
    description: page.description,
    path: page.path,
  });

  return (
    <main className={styles.page}>
      <StructuredData data={isFaq ? [faqSchema] : undefined} />
      <StructuredData data={breadcrumbSchema(crumbs)} />
      <section className={styles.hero}>
        <ResponsivePicture
          image={isFaq ? APARTMENT.images.living : APARTMENT.images.hero}
          alt=""
          className={styles.heroImg}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
        <div className={styles.heroInner}>
          <Breadcrumbs items={crumbs} />
          <p className={styles.eyebrow}>{page.eyebrow}</p>
          <h1 className={styles.title}>{page.h1}</h1>
          <p className={styles.lead}>{page.lead}</p>
          <div className={styles.actions}>
            <Link to="/" state={{ scrollTo: 'hero' }} className={styles.primary} onClick={() => trackBookingOpen({ placement: 'seo_hero' })}>
              Забронировать
            </Link>
            <a href={whatsappHref} className={styles.secondary} onClick={() => trackWhatsapp({ placement: 'seo_hero' })}>
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.highlights}>
          {page.highlights.map((item) => (
            <span key={item} className={styles.chip}>{item}</span>
          ))}
        </div>

        {isFaq ? (
          <div className={styles.grid}>
            <div className={styles.faqList} itemScope itemType="https://schema.org/FAQPage">
              {faqItems.map((item) => (
                <section
                  key={item.q}
                  className={styles.faqItem}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h2 itemProp="name">{item.q}</h2>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text">{item.a}</p>
                  </div>
                </section>
              ))}
            </div>
            <BookingAside />
          </div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.sections}>
              {page.sections.map((section) => (
                <section key={section.title} className={styles.section}>
                  <h2>{section.title}</h2>
                  {(Array.isArray(section.text) ? section.text : [section.text]).map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </section>
              ))}
              {page.priceCompare && (
                <section className={styles.section}>
                  <h2>{page.priceCompare.title}</h2>
                  <p>{page.priceCompare.intro}</p>
                  <div className={styles.tableWrap}>
                    <table className={styles.articleTable}>
                      <thead>
                        <tr>
                          <th>Площадка</th>
                          <th>Цена</th>
                          <th>Комментарий</th>
                        </tr>
                      </thead>
                      <tbody>
                        {page.priceCompare.rows.map((row) => (
                          <tr key={row.source}>
                            <td>
                              {row.href ? (
                                <a href={row.href} target="_blank" rel="noopener">{row.source}</a>
                              ) : (
                                row.source
                              )}
                            </td>
                            <td>{row.price}</td>
                            <td>{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {page.priceCompare.note && <p>{page.priceCompare.note}</p>}
                </section>
              )}
              {page.distances && (
                <section className={styles.section}>
                  <h2>{page.distances.title}</h2>
                  <p>{page.distances.intro}</p>
                  <div className={styles.tableWrap}>
                    <table className={styles.articleTable}>
                      <thead>
                        <tr>
                          <th>Куда</th>
                          <th>Расстояние</th>
                        </tr>
                      </thead>
                      <tbody>
                        {page.distances.rows.map((row) => (
                          <tr key={row.place}>
                            <td>{row.place}</td>
                            <td>{row.distance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {page.distances.note && <p>{page.distances.note}</p>}
                </section>
              )}
              <section className={styles.section}>
                <h2>Почему выбирают R14-APART</h2>
                <ul>
                  {APARTMENT.features.map((feature) => (
                    <li key={feature.title}>{feature.title}: {feature.text}</li>
                  ))}
                </ul>
              </section>
            </div>
            <BookingAside />
          </div>
        )}
      </div>
    </main>
  );
}
