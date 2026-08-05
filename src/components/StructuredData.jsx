import { APARTMENT, FAQ, REVIEW_PLATFORMS } from '../data/apartment';
import { faqItems, seoDefaults } from '../data/seo';

const addressId = `${seoDefaults.siteUrl}/#address`;
const lodgingId = `${seoDefaults.siteUrl}/#lodging`;
const apartmentId = `${seoDefaults.siteUrl}/#apartment`;
const yandexMapUrl = 'https://yandex.ru/maps/org/r14_apart/95912541487/';

const verifiedReviewSchema = {
  '@type': 'Review',
  itemReviewed: { '@id': lodgingId, '@type': 'LodgingBusiness', name: APARTMENT.name },
  author: { '@type': 'Person', name: 'Константин' },
  datePublished: '2026-07-15',
  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  reviewBody:
    'Апартаменты полностью соответствуют представленным фотографиям. Внутри очень уютно, видно, что хозяева вложили душу в дизайн и ремонт.',
  publisher: { '@type': 'Organization', name: 'Ostrovok.ru' },
};

const faqSchemaFor = (items, id) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': id,
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
});

const lodgingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'PostalAddress',
      '@id': addressId,
      streetAddress: 'ул. Революции, 14',
      addressLocality: APARTMENT.city,
      addressRegion: APARTMENT.region,
      addressCountry: 'RU',
    },
    {
      '@type': 'LodgingBusiness',
      '@id': lodgingId,
      name: APARTMENT.name,
      description: APARTMENT.description,
      url: seoDefaults.siteUrl,
      telephone: `+${APARTMENT.phone}`,
      email: APARTMENT.email,
      address: { '@id': addressId },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: APARTMENT.latitude,
        longitude: APARTMENT.longitude,
      },
      sameAs: REVIEW_PLATFORMS.filter((platform) => platform.sameAs !== false).map((platform) => platform.href),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '21',
        bestRating: '5',
        worstRating: '1',
      },
      review: [verifiedReviewSchema],
      hasMap: yandexMapUrl,
      checkinTime: '14:00',
      checkoutTime: '12:00',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
      petsAllowed: true,
      currenciesAccepted: 'RUB',
      paymentAccepted: 'Cash, Credit Card',
      amenityFeature: APARTMENT.amenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.label,
        value: true,
      })),
      priceRange: `от ${APARTMENT.priceFrom} RUB`,
    },
    {
      '@type': 'Apartment',
      '@id': apartmentId,
      name: APARTMENT.name,
      url: seoDefaults.siteUrl,
      address: { '@id': addressId },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: String(APARTMENT.area),
        unitCode: 'MTK',
      },
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: String(APARTMENT.guests),
      },
      numberOfRooms: 1,
    },
  ],
};

export const homeFaqSchema = faqSchemaFor(FAQ, `${seoDefaults.siteUrl}/#faq`);
export const faqSchema = faqSchemaFor(faqItems, `${seoDefaults.siteUrl}/faq/#faq`);

export default function StructuredData({ data = [lodgingSchema, homeFaqSchema] }) {
  if (typeof document !== 'undefined' && document.querySelector('script[data-prerender-schema="true"]')) {
    return null;
  }

  return (
    <>
      {(Array.isArray(data) ? data : [data]).map((item, index) => (
        <script
          key={`${item['@type'] ?? 'schema'}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
