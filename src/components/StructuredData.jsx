import { APARTMENT } from '../data/apartment';
import { faqItems, seoDefaults } from '../data/seo';

const lodgingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LodgingBusiness',
      '@id': `${seoDefaults.siteUrl}/#lodging`,
      name: APARTMENT.name,
      description: APARTMENT.description,
      url: seoDefaults.siteUrl,
      telephone: APARTMENT.phone,
      email: APARTMENT.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Революции, 14',
        addressLocality: APARTMENT.city,
        addressRegion: APARTMENT.region,
        addressCountry: 'RU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: APARTMENT.latitude,
        longitude: APARTMENT.longitude,
      },
      petsAllowed: true,
      amenityFeature: APARTMENT.amenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.label,
        value: true,
      })),
      priceRange: `от ${APARTMENT.priceFrom} RUB`,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(APARTMENT.rating),
        reviewCount: String(APARTMENT.reviewCount),
      },
    },
    {
      '@type': 'Apartment',
      '@id': `${seoDefaults.siteUrl}/#apartment`,
      name: APARTMENT.name,
      url: seoDefaults.siteUrl,
      address: { '@id': `${seoDefaults.siteUrl}/#lodging` },
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
    {
      '@type': 'Offer',
      '@id': `${seoDefaults.siteUrl}/#offer`,
      url: `${seoDefaults.siteUrl}/#hero`,
      priceCurrency: 'RUB',
      price: String(APARTMENT.priceFrom),
      availability: 'https://schema.org/InStock',
      itemOffered: { '@id': `${seoDefaults.siteUrl}/#apartment` },
    },
  ],
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function StructuredData({ data = [lodgingSchema, faqSchema] }) {
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

