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
