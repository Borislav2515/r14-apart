import { APARTMENT_INFO, REVIEWS, FAQ, STATS, REVIEW_PLATFORMS } from './apartment-data';

const responsiveAssets = import.meta.glob(
  '../assets/imgs/apart/responsive/*.{avif,webp,jpg}',
  { eager: true, import: 'default' }
);

const widths = [640, 960, 1400, 1800];

const sourcesFor = (name) => ({
  avif: widths
    .map((width) => `${responsiveAssets[`../assets/imgs/apart/responsive/${name}-${width}.avif`]} ${width}w`)
    .join(', '),
  webp: widths
    .map((width) => `${responsiveAssets[`../assets/imgs/apart/responsive/${name}-${width}.webp`]} ${width}w`)
    .join(', '),
  jpg: widths
    .map((width) => `${responsiveAssets[`../assets/imgs/apart/responsive/${name}-${width}.jpg`]} ${width}w`)
    .join(', '),
});

const imageFor = (name) => ({
  jpg: responsiveAssets[`../assets/imgs/apart/responsive/${name}-1400.jpg`],
  avif: responsiveAssets[`../assets/imgs/apart/responsive/${name}-1400.avif`],
  webp: responsiveAssets[`../assets/imgs/apart/responsive/${name}-1400.webp`],
  sources: sourcesFor(name),
});

export const APARTMENT = {
  ...APARTMENT_INFO,
  images: {
    hero: imageFor('hero'),
    living: imageFor('living'),
    bedroom: imageFor('bedroom'),
    kitchen: imageFor('kitchen'),
    bathroom: imageFor('bathroom'),
  },
};

export { REVIEWS, FAQ, STATS, REVIEW_PLATFORMS };
