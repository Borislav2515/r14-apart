import { APARTMENT } from '../data/apartment';
import { trackMap, trackRoute } from '../utils/analytics';
import Reveal from './Reveal';
import styles from './MapSection.module.css';

const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${APARTMENT.longitude}%2C${APARTMENT.latitude}&z=16&pt=${APARTMENT.longitude}%2C${APARTMENT.latitude}%2Cpm2rdm`;
const routeHref = `https://yandex.ru/maps/?rtext=~${APARTMENT.latitude},${APARTMENT.longitude}&rtt=auto`;

export default function MapSection() {
  return (
    <section className={styles.section} aria-labelledby="map-heading">
      <div className={styles.inner}>
        <Reveal className={styles.copy} y={32}>
          <p className={styles.label}>Локация</p>
          <h2 id="map-heading" className={styles.title}>
            Центр<br /><em>Владикавказа</em>
          </h2>
          <p className={styles.text}>
            {APARTMENT.address}. Удобная точка для прогулок по историческому центру,
            командировок и выездов по Северной Осетии.
          </p>
          <a href={routeHref} className={styles.route} onClick={trackRoute}>
            Построить маршрут
          </a>
        </Reveal>

        <Reveal className={styles.mapWrap} delay={0.1} y={32}>
          <iframe
            title="R14-APART на карте"
            src={mapSrc}
            className={styles.map}
            loading="lazy"
            onLoad={trackMap}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}
