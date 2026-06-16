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
  name: 'R14-APART',
  tagline: 'Двухуровневые апартаменты посуточно в историческом центре Владикавказа',
  area: 45,
  guests: 4,
  rating: 5.0,
  reviewCount: 247,
  phone: '89060330014',
  email: 'r14.group@gmail.com',
  address: 'Владикавказ, ул. Революции, 14',
  city: 'Владикавказ',
  region: 'Республика Северная Осетия — Алания',
  latitude: 43.0281528,
  longitude: 44.6838663,
  priceFrom: 7500,
  description:
    'R14-APART — двухуровневые апартаменты в отдельностоящем здании с отдельным входом с улицы. Исторический центр Владикавказа, тихая улица, премиальный ремонт, умный дом и бесконтактное заселение 24/7 по паролю.',
  images: {
    hero: imageFor('hero'),
    living: imageFor('living'),
    bedroom: imageFor('bedroom'),
    kitchen: imageFor('kitchen'),
    bathroom: imageFor('bathroom'),
  },
  amenities: [
    { icon: '📶', label: 'WiFi 200 Мбит/с' },
    { icon: '📺', label: 'Смарт-ТВ' },
    { icon: '☕', label: 'Кофемашина' },
    { icon: '🫧', label: 'Стиральная машина' },
    { icon: '❄️', label: 'Кондиционер' },
    { icon: '🔥', label: 'Умное отопление' },
    { icon: '💡', label: 'Умное освещение' },
    { icon: '🍳', label: 'Полная кухня' },
    { icon: '🛁', label: 'Ванна' },
    { icon: '🅿️', label: 'Парковка' },
    { icon: '🔑', label: 'Смарт-замок' },
    { icon: '🛎', label: 'Заселение 24/7' },
    { icon: '🧾', label: 'Отчётные документы' },
  ],
  features: [
    {
      icon: '⏱',
      title: 'Бесконтактное заселение 24/7',
      text: 'Заезд в любое удобное время по персональному паролю. Без ключей, без ожиданий, с полным контролем доступа.',
    },
    {
      icon: '✦',
      title: 'Премиальный двухуровневый интерьер',
      text: '45 м² стильного пространства в отдельностоящем здании с отдельным входом. Тишина и приватность в центре города.',
    },
    {
      icon: '⌂',
      title: 'Умный дом',
      text: 'Управление освещением, отоплением и кондиционером для комфортного проживания в любой сезон.',
    },
    {
      icon: '◈',
      title: 'Прозрачные условия',
      text: 'Стоимость от 7500 ₽ в сутки, без залога. Можно с детьми и воспитанными животными, предоставляем отчётные документы.',
    },
  ],
};

export const REVIEWS = [
  {
    id: 1,
    text: 'Идеальное место для романтического уикенда. Интерьер — просто шедевр, чистота безупречная.',
    author: 'Анна К.',
    city: 'Москва',
    stars: 5,
  },
  {
    id: 2,
    text: 'Останавливался в командировку. Всё продумано: быстрый WiFi, кофемашина, тихий район.',
    author: 'Дмитрий П.',
    city: 'Санкт-Петербург',
    stars: 5,
  },
  {
    id: 3,
    text: 'Лучшие апартаменты, в которых я когда-либо жила. Сервис — как в пятизвёздочном отеле.',
    author: 'Мария С.',
    city: 'Екатеринбург',
    stars: 5,
  },
  {
    id: 4,
    text: 'Приехали семьёй с ребёнком. Просторно, чисто, уютно. Хозяева отзывчивые — помогли с парковкой.',
    author: 'Семья Воронцовых',
    city: 'Казань',
    stars: 5,
  },
  {
    id: 5,
    text: 'Забронировал за день, всё прошло гладко. Код пришёл вовремя, апартаменты превзошли ожидания.',
    author: 'Игорь Б.',
    city: 'Новосибирск',
    stars: 5,
  },
];

export const FAQ = [
  {
    id: 1,
    q: 'Как забронировать апартаменты?',
    a: 'Выберите даты и количество гостей в форме на главной странице. Нажмите «Забронировать», оплатите онлайн. Подтверждение и код от замка придут на email и SMS.',
  },
  {
    id: 2,
    q: 'Какое минимальное количество ночей?',
    a: 'Минимальный срок — 1 ночь. Стоимость проживания — от 7500 ₽ в сутки.',
  },
  {
    id: 3,
    q: 'Можно ли заехать ночью?',
    a: 'Да, заезд возможен в любое время суток. Все объекты оснащены смарт-замками. За час до заезда на ваш телефон придёт одноразовый код.',
  },
  {
    id: 4,
    q: 'Нужен ли залог и предоставляете ли документы?',
    a: 'Залог не требуется. По запросу предоставляем отчётные документы для командировок.',
  },
  {
    id: 5,
    q: 'Можно ли с детьми и питомцами?',
    a: 'Да, можно с детьми и воспитанными животными по предварительному согласованию при бронировании.',
  },
];

export const STATS = [
  { value: 247, label: 'довольных гостей', decimal: false },
  { value: 5.0, label: 'средняя оценка', decimal: true },
  { value: 45, label: 'м² площадь', decimal: false },
  { value: 24, label: 'заселение 24/7', decimal: false },
];

export const REVIEW_PLATFORMS = [
  {
    name: 'Яндекс Путешествия',
    rating: '5 из 5',
    score: 'Суперхозяин',
    reviews: '10+ отзывов',
    brand: 'yandex',
    color: '#25ac01',
    href: 'https://travel.yandex.ru/search/?text=R14-APART%20%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BA%D0%B0%D0%B2%D0%BA%D0%B0%D0%B7',
  },
  {
    name: 'Островок',
    rating: '10 из 10',
    score: 'Превосходно',
    reviews: '20+ отзывов',
    brand: 'ostrovok',
    color: '#25ac01',
    href: 'https://ostrovok.ru/hotel/russia/vladikavkaz/mid13166131/r14_flat/?dates=20.06.2026-21.06.2026&guests=2&type_group=apart&room=s-f1b5470e-ac7f-50fc-8e16-fc53b8dd9cc6&q=2650',
  },
  {
    name: 'Суточно.ру',
    rating: '10 из 10',
    score: 'Суперхозяин',
    color: '#d28a00',
    reviews: '25+ отзывов',
    brand: 'sutochno',
    href: 'https://sutochno.ru/front/searchapp/detail/1938216?occupied=2026-06-18%3B2026-06-19&guests_adults=2&id=281425&type=city&term=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BA%D0%B0%D0%B2%D0%BA%D0%B0%D0%B7&price_per=1&SW.lat=42.955195&SW.lng=44.603788&NE.lat=43.087553&NE.lng=44.742165',
  },
  {
    name: 'Авито',
    rating: '5 из 5',
    score: 'Превосходно',
    reviews: '6+ отзывов',
    color: '#6900d2',
    brand: 'avito',
    href: 'https://www.avito.ru/profile/rating?page_from=profile_menu',
  },
  {
    name: 'Твил',
    rating: '5 из 5',
    score: 'Суперхозяин',
    reviews: '30+ отзывов',
    color: '#6900d2',
    brand: 'tvil',
    href: 'https://tvil.ru/city/vladikavkaz/flats/?q=R14-APART',
  },
];
