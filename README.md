# R14-APART — Сайт посуточной аренды

Vite + React проект для презентации апартаментов **R14-APART** с онлайн-бронированием через [HomeReserve](https://homereserve.ru).

## Стек

- **Vite** — сборщик
- **React 18** — UI
- **React Router v6** — роутинг с бесшовными переходами
- **Framer Motion** — анимации и параллакс
- **CSS Modules** — изолированные стили

## Структура проекта

```
r14apart/
├── index.html              # SEO: title, meta, Schema.org JSON-LD
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── main.jsx            # Точка входа
    ├── App.jsx             # Router + AnimatePresence
    ├── styles/
    │   └── globals.css     # CSS-переменные, базовые стили
    ├── data/
    │   └── apartment.js    # Весь контент: фото, описание, отзывы, FAQ
    ├── hooks/
    │   ├── useScrollReveal.js
    │   └── useCounter.js
    ├── components/
    │   ├── Cursor          # Кастомный курсор
    │   ├── Navbar          # Навигация + бургер-меню
    │   ├── Hero            # Hero с виджетом HomeReserve
    │   ├── StatsBar        # Статистика в ряд
    │   ├── About           # Витрина апартаментов
    │   ├── Gallery         # Параллакс-галерея
    │   ├── Features        # Преимущества
    │   ├── Reviews         # Бегущая лента отзывов
    │   ├── FaqSection      # Аккордеон FAQ
    │   ├── Cta             # Финальный призыв к действию
    │   └── Footer          # Подвал
    └── pages/
        └── Home.jsx
```

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173`

## Сборка для продакшена

```bash
npm run build
# Готовые файлы в папке /dist
```

## Кастомизация

Весь контент — в одном файле `src/data/apartment.js`:
- Фотографии (ссылки Unsplash → замените на свои)
- Описание апартаментов
- Список удобств и фич
- Отзывы гостей
- FAQ
- Контакты

## Виджет HomeReserve

Виджет инициализируется в `src/components/Hero.jsx`.  
Токен: `lJ9CQtdlv9`

Если нужно сменить токен — меняйте в одном месте:
```js
window.homereserve.initWidgetSearch({ token: 'ВАШ_ТОКЕН', tag: 'site' });
```

## SEO

- `index.html` — полный набор мета-тегов, Open Graph, Twitter Card
- Schema.org JSON-LD: `Apartment`, `FAQPage`, `AggregateRating`
- `itemScope`/`itemProp` микроразметка на компонентах
- `loading="lazy"` на всех изображениях ниже hero
- `robots.txt` в `/public`
- `alt` с ключевыми словами на всех изображениях
