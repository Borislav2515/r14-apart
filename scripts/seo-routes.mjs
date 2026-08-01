export const SITE_URL = 'https://r14-apart.com';
export const OG_IMAGE = `${SITE_URL}/og-r14-apart.jpg`;

export const canonicalPathFor = (path) => {
  if (path === '/') return '/';
  return `${path.replace(/\/+$/, '')}/`;
};

export const canonicalUrlFor = (path) => new URL(canonicalPathFor(path), SITE_URL).toString();

export const seoRoutes = [
  {
    path: '/',
    title: 'Квартира посуточно во Владикавказе | R14-APART, ул. Революции 14',
    description:
      'Снять квартиру посуточно во Владикавказе: R14-APART в историческом центре, ул. Революции 14. До 4 гостей, 45 м², Wi-Fi, парковка, бесконтактное заселение 24/7, от 7500 ₽.',
    changefreq: 'weekly',
    priority: '1.0',
    type: 'website',
  },
  {
    path: '/kvartira-posutochno-vladikavkaz-center',
    title: 'Квартира посуточно в центре Владикавказа | R14-APART',
    description:
      'Квартира посуточно в центре Владикавказа: ул. Революции 14, тихая улица, отдельный вход, парковка, Wi-Fi и самостоятельное заселение.',
    changefreq: 'monthly',
    priority: '0.9',
    type: 'website',
  },
  {
    path: '/komandirovka-vladikavkaz',
    title: 'Квартира для командировки во Владикавказе | R14-APART',
    description:
      'Квартира для командировки во Владикавказе: быстрый Wi-Fi, отчётные документы, самостоятельное заселение 24/7, кухня, центр города.',
    changefreq: 'monthly',
    priority: '0.85',
    type: 'website',
  },
  {
    path: '/bez-posrednikov',
    title: 'Квартира посуточно во Владикавказе без посредников | R14-APART',
    description:
      'Квартира посуточно во Владикавказе без посредников: R14-APART, прямое бронирование, центр, самостоятельное заселение, Wi-Fi, парковка.',
    changefreq: 'monthly',
    priority: '0.85',
    type: 'website',
  },
  {
    path: '/faq',
    title: 'Частые вопросы об апартаментах во Владикавказе | R14-APART',
    description:
      'Ответы на частые вопросы о R14-APART: дети, парковка, ночное заселение, Wi-Fi, кухня, животные, вместимость и самостоятельный заезд.',
    changefreq: 'monthly',
    priority: '0.75',
    type: 'website',
    schemaType: 'FAQPage',
  },
  {
    path: '/blog',
    title: 'Блог о Владикавказе и Северной Осетии | R14-APART',
    description:
      'Полезные материалы R14-APART о поездках во Владикавказ, маршрутах по Северной Осетии, проживании в центре и путешествиях на выходные.',
    changefreq: 'weekly',
    priority: '0.8',
    type: 'website',
    schemaType: 'Blog',
  },
  {
    path: '/blog/where-to-stay-vladikavkaz',
    title: 'Где остановиться туристу во Владикавказе: какой район выбрать | R14-APART',
    description:
      'Какой район Владикавказа выбрать туристу: центр у проспекта Мира или окраина. Реальные расстояния до музея, театра и набережной пешком.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/2-days-vladikavkaz',
    title: 'Владикавказ за 2 дня: маршрут пешком от проспекта Мира | R14-APART',
    description:
      'Маршрут на 2 дня по Владикавказу пешком: проспект Мира, набережная Терека, мечеть Мухтарова, парк Хетагурова — и куда выехать на второй день.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/ossetia-mountains-trip',
    title: 'Владикавказ — Цей: как добраться и сколько закладывать времени | R14-APART',
    description:
      'Как доехать из Владикавказа до горнолыжного курорта Цей: расстояние, состояние дороги, автобус от автовокзала и сколько времени закладывать на поездку.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/dargavs-guide',
    title: 'Как доехать до Даргавса из Владикавказа: маршрутка, цена, город мёртвых | R14-APART',
    description:
      'Как добраться до Даргавса из Владикавказа без машины: где садиться на маршрутку, сколько стоит вход в некрополь и сколько времени закладывать на поездку.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/best-places-ossetia',
    title: 'Лучшие места Северной Осетии для поездки из Владикавказа | R14-APART',
    description:
      'Три однодневных маршрута из Владикавказа: некрополь Даргавс, Кадаргаванский каньон в Куртатинском ущелье и горнолыжный курорт Цей. Расстояния и время в пути.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/business-trip-vladikavkaz',
    title: 'Командировка во Владикавказ: где остановиться | R14-APART',
    description:
      'Как выбрать жильё для командировки во Владикавказе: отчётные документы без НДС, Wi-Fi, поздний заезд без привязки к рейсу и центр города.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/apartment-with-self-checkin-vladikavkaz',
    title: 'Апартаменты с самостоятельным заселением во Владикавказе | R14-APART',
    description:
      'Как работает самостоятельное заселение по смарт-коду в R14-APART: когда приходит код, что делать при позднем заезде и как связаться с хозяином.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/gde-ostanovitsya-vo-vladikavkaze',
    title: 'Где остановиться во Владикавказе: апартаменты, гостиница или хостел | R14-APART',
    description:
      'Сравниваем гостиницы, хостелы и апартаменты посуточно во Владикавказе — что выбрать туристу, семье или командировочному в 2026 году.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/kak-dobratsya-do-vladikavkaza',
    title: 'Как добраться до Владикавказа: самолёт, поезд, машина | R14-APART',
    description:
      'Все способы доехать до Владикавказа в 2026 году — самолётом через аэропорт Беслан, поездом из Москвы, на машине по трассам Кавказа. Время в пути и что учесть.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/blog/kurtatinskoe-ushchelye-kadarganvanskiy-kanyon',
    title: 'Куртатинское ущелье и Кадаргаванский каньон: как добраться и что посмотреть | R14-APART',
    description:
      'Маршрут по Куртатинскому ущелью — Кадаргаванский каньон, Тропа чудес, крепость Дзивгис. Как доехать из Владикавказа, сколько времени закладывать и что взять с собой.',
    changefreq: 'monthly',
    priority: '0.7',
    type: 'article',
    schemaType: 'BlogPosting',
  },
  {
    path: '/rules',
    title: 'Правила дома | R14-APART',
    description:
      'Правила проживания в апартаментах R14-APART: заезд, выезд, гости, дети, питомцы, связь и бережное использование пространства.',
    changefreq: 'monthly',
    priority: '0.3',
    type: 'website',
  },
];

export const serviceRoutes = [
  {
    path: '/guest-guide',
    title: 'Инструкция для гостей | R14-APART',
    description:
      'Краткая инструкция для гостей R14-APART: команды Алисы, свет, кондиционер, терморегуляторы, техника и правила проживания.',
    robots: 'noindex, nofollow',
  },
  {
    path: '/privacy',
    title: 'Политика конфиденциальности | R14-APART',
    description: 'Информация об обработке персональных данных на сайте R14-APART.',
    robots: 'noindex, nofollow',
  },
  {
    path: '/cookies',
    title: 'Политика использования cookie | R14-APART',
    description: 'Информация об использовании cookie на сайте R14-APART.',
    robots: 'noindex, nofollow',
  },
  {
    path: '/consent',
    title: 'Согласие на обработку персональных данных | R14-APART',
    description: 'Согласие пользователя на обработку персональных данных для связи и оказания услуг.',
    robots: 'noindex, nofollow',
  },
  {
    path: '/agreement',
    title: 'Пользовательское соглашение | R14-APART',
    description: 'Условия использования сайта R14-APART и онлайн-сервисов бронирования.',
    robots: 'noindex, nofollow',
  },
];
