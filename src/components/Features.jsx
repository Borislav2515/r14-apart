import { APARTMENT } from '../data/apartment';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './Features.module.css';

export default function Features() {
  return (
    <section className={styles.section} aria-labelledby="feat-heading">
      <div className={styles.layout}>
        <Reveal className={styles.imgWrap} x={-40} y={0}>
          <ResponsivePicture
            image={APARTMENT.images.living}
            alt="Уютная гостиная апартаментов R14-APART"
            className={styles.imgMain}
            sizes="(max-width: 960px) 100vw, 45vw"
          />
          <ResponsivePicture
            image={APARTMENT.images.kitchen}
            alt="Детали интерьера R14-APART"
            className={styles.imgAccent}
            sizes="(max-width: 960px) 45vw, 280px"
          />
        </Reveal>

        <div className={styles.right}>
          <Reveal as="p" className={styles.label}>Почему R14-APART</Reveal>
          <Reveal as="h2" className={styles.title} id="feat-heading" delay={0.1}>
            Всё<br />продумано<br /><em>за вас</em>
          </Reveal>

          <ul className={styles.list} role="list">
            {APARTMENT.features.map((f, i) => (
              <Reveal as="li" key={f.title} className={styles.item} delay={0.1 + i * 0.1}>
                <div className={styles.icon} aria-hidden="true">{f.icon}</div>
                <div>
                  <h3 className={styles.itemTitle}>{f.title}</h3>
                  <p className={styles.itemText}>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
