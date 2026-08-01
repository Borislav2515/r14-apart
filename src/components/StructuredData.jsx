import { APARTMENT, FAQ, REVIEW_PLATFORMS } from '../data/apartment';
import { faqItems, seoDefaults } from '../data/seo';

const addressId = `${seoDefaults.siteUrl}/#address`;
const lodgingId = `${seoDefaults.siteUrl}/#lodging`;
const apartmentId = `${seoDefaults.siteUrl}/#apartment`;

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
      petsAllowed: true,
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
      numberOfRooms: '2',
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
