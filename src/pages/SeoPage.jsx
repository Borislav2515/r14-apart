import { Link, useLocation } from 'react-router-dom';
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
        <Link to="/" state={{ scrollTo: 'hero' }} className={styles.primary} onClick={trackBookingOpen}>
          Забронировать
        </Link>
        <a href={whatsappHref} className={styles.secondary} onClick={trackWhatsapp}>
          WhatsApp
        </a>
      </div>
    </aside>
  );
}

export default function SeoPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/+/, '') || 'apartments-vladikavkaz';
  const page = getPageBySlug(slug) ?? getPageBySlug('apartments-vladikavkaz');
  const isFaq = page.slug === 'faq';

  usePageMeta({
    title: page.title,
    description: page.description,
    path: page.path,
  });

  return (
    <main className={styles.page}>
      <StructuredData data={isFaq ? [faqSchema] : undefined} />
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
          <p className={styles.eyebrow}>{page.eyebrow}</p>
          <h1 className={styles.title}>{page.h1}</h1>
          <p className={styles.lead}>{page.lead}</p>
          <div className={styles.actions}>
            <Link to="/" state={{ scrollTo: 'hero' }} className={styles.primary} onClick={trackBookingOpen}>
              Забронировать
            </Link>
            <a href={whatsappHref} className={styles.secondary} onClick={trackWhatsapp}>
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
                  <p>{section.text}</p>
                </section>
              ))}
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
