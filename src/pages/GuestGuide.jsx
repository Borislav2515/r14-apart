import { APARTMENT } from '../data/apartment';
import usePageMeta from '../hooks/usePageMeta';
import { phoneHref, telegramHref, whatsappHref } from '../utils/analytics';
import styles from './GuestGuide.module.css';

const HOME_ASSISTANT_URL = 'https://ha.r14-apart.com';

const quickLinks = [
  { href: '#alice', label: 'Алиса' },
  { href: '#climate', label: 'Климат' },
  { href: '#appliances', label: 'Техника' },
  { href: '#housekeeping', label: 'Шкаф' },
  { href: '#rules', label: 'Правила', wide: true },
];

const lightZones = [
  {
    title: 'Основное помещение',
    note: 'трековый свет',
    commands: ['Алиса, включи основной свет', 'Алиса, выключи основной свет'],
  },
  {
    title: 'Обеденная зона',
    note: 'свет над баром',
    commands: ['Алиса, включи свет над баром', 'Алиса, выключи свет над баром'],
  },
  {
    title: 'Кухня',
    note: 'рабочая зона',
    commands: ['Алиса, включи свет над кухней', 'Алиса, выключи свет над кухней'],
  },
  {
    title: 'Коридор',
    note: 'пространство перед ванной',
    commands: ['Алиса, включи свет в коридоре', 'Алиса, выключи свет в коридоре'],
  },
  {
    title: 'Ванная',
    note: 'свет и душевая',
    commands: [
      'Алиса, включи свет в ванной',
      'Алиса, выключи свет в ванной',
      'Алиса, включи подсветку в душевой',
      'Алиса, выключи подсветку в душевой',
    ],
  },
  {
    title: 'Прихожая',
    note: 'подсветка',
    commands: ['Алиса, включи подсветку в прихожей', 'Алиса, выключи подсветку в прихожей'],
  },
  {
    title: 'Спальня',
    note: 'второй уровень',
    commands: ['Алиса, включи свет в спальне', 'Алиса, выключи свет в спальне'],
  },
];

const conditionerModes = [
  'Алиса, поставь режим охлаждения на кондиционере',
  'Алиса, поставь режим осушения на кондиционере',
  'Алиса, поставь режим нагрева на кондиционере',
  'Алиса, поставь режим вентиляции на кондиционере',
];

const fanSpeeds = [
  'Алиса, включи автоматическую скорость вентиляции',
  'Алиса, включи низкую скорость вентиляции',
  'Алиса, включи среднюю скорость вентиляции',
  'Алиса, включи высокую скорость вентиляции',
];

const temperatureCommands = [
  'Алиса, прибавь температуру на кондиционере',
  'Алиса, убавь температуру на кондиционере',
];

function CommandList({ commands }) {
  return (
    <ul className={styles.commands}>
      {commands.map((command) => (
        <li key={command}>{command}</li>
      ))}
    </ul>
  );
}

export default function GuestGuide() {
  usePageMeta({
    title: 'Инструкция для гостей | R14-APART',
    description:
      'Краткая инструкция для гостей R14-APART: команды Алисы, свет, кондиционер, терморегуляторы, техника и правила проживания.',
    path: '/guest-guide',
    robots: 'noindex, nofollow',
  });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Памятка гостя</p>
          <h1>Добро пожаловать в R14-APART</h1>
          <p className={styles.lead}>
            Короткая инструкция по свету, климату и оборудованию в апартаментах.
            Сохраните эту страницу — она пригодится во время проживания.
          </p>
          <nav className={styles.quickNav} aria-label="Разделы инструкции">
            {quickLinks.map((link) => (
              <a key={link.href} className={link.wide ? styles.quickWide : undefined} href={link.href}>
                {link.label}
              </a>
            ))}
            <a className={`${styles.quickPrimary} ${styles.quickWide}`} href={HOME_ASSISTANT_URL} target="_blank" rel="noreferrer">
              Панель умного дома
            </a>
          </nav>
        </div>
      </section>

      <section id="alice" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Голосовое управление</p>
          <h2>Команды для Алисы</h2>
          <p>Начните фразу со слова “Алиса”, затем произнесите нужную команду.</p>
        </div>

        <div className={styles.cardGrid}>
          {lightZones.map((zone) => (
            <article key={zone.title} className={styles.card}>
              <div className={styles.cardTop}>
                <h3>{zone.title}</h3>
                <span>{zone.note}</span>
              </div>
              <CommandList commands={zone.commands} />
            </article>
          ))}
        </div>

        <article className={styles.wideCard}>
          <div className={styles.cardTop}>
            <h3>Кондиционер</h3>
            <span>режим, скорость и температура</span>
          </div>
          <div className={styles.commandColumns}>
            <div>
              <h4>Режим</h4>
              <CommandList commands={conditionerModes} />
            </div>
            <div>
              <h4>Скорость вентиляции</h4>
              <CommandList commands={fanSpeeds} />
            </div>
            <div>
              <h4>Температура</h4>
              <CommandList commands={temperatureCommands} />
            </div>
          </div>
        </article>
      </section>

      <section id="climate" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Тепло и комфорт</p>
          <h2>Терморегуляторы</h2>
        </div>
        <div className={styles.infoGrid}>
          <article className={styles.infoCard}>
            <h3>У входной двери</h3>
            <p>Регулирует температуру в общем помещении: батареи и тёплый пол.</p>
          </article>
          <article className={styles.infoCard}>
            <h3>В ванной комнате</h3>
            <p>Отвечает за температуру в ванной зоне.</p>
          </article>
          <article className={styles.infoCard}>
            <h3>Как изменить температуру</h3>
            <p>Нажмите “+” или “–” на нужном терморегуляторе.</p>
          </article>
        </div>
      </section>

      <section id="appliances" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Техника</p>
          <h2>Кухня и кофе</h2>
        </div>
        <div className={styles.infoGrid}>
          <article className={styles.infoCard}>
            <h3>Варочная панель</h3>
            <p>Если на панели появились буквы “Lo”, включилась блокировка от детей.</p>
            <ol>
              <li>Найдите кнопку с изображением ключа.</li>
              <li>Нажмите и удерживайте её несколько секунд.</li>
            </ol>
          </article>
          <article className={styles.infoCard}>
            <h3>Кофемашина</h3>
            <ol>
              <li>Потяните ручку наверх.</li>
              <li>Вставьте капсулу.</li>
              <li>Нажмите 40 мл или 110 мл.</li>
            </ol>
          </article>
        </div>
      </section>

      <section id="housekeeping" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Полезно знать</p>
          <h2>Хозяйственный шкаф</h2>
          <p>В шкафу перед душевой комнатой находятся вещи для ухода за одеждой.</p>
        </div>
        <div className={styles.supplyList}>
          <span>Складная сушилка для белья</span>
          <span>Утюг</span>
          <span>Гладильная доска</span>
        </div>
      </section>

      <section id="rules" className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Важные просьбы</p>
          <h2>Чтобы всем было комфортно</h2>
        </div>
        <div className={styles.ruleGrid}>
          <article>
            <strong>Тишина после 23:00</strong>
            <p>Пожалуйста, уважайте покой соседей.</p>
          </article>
          <article>
            <strong>Не курить в апартаментах</strong>
            <p>Курение внутри апартаментов строго запрещено.</p>
          </article>
          <article>
            <strong>Не курить под окнами</strong>
            <p>Так мы избегаем неприятных ситуаций с соседями.</p>
          </article>
        </div>
      </section>

      <section className={styles.final}>
        <p className={styles.eyebrow}>Связь и управление</p>
        <h2>Если что-то не получается</h2>
        <p>
          Напишите нам или откройте панель управления умным домом.
          Адрес апартаментов: {APARTMENT.address}.
        </p>
        <div className={styles.finalActions}>
          <a className={styles.primary} href={HOME_ASSISTANT_URL} target="_blank" rel="noreferrer">
            Панель умного дома
          </a>
          <a className={styles.secondary} href={whatsappHref}>WhatsApp</a>
          <a className={styles.secondary} href={telegramHref}>Telegram</a>
          <a className={styles.secondary} href={phoneHref}>Позвонить</a>
        </div>
      </section>
    </main>
  );
}
