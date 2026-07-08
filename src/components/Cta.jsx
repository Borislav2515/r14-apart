import { APARTMENT } from '../data/apartment';
import { useBookingModal } from '../context/BookingModalContext';
import { trackBookingOpen, trackPhone } from '../utils/analytics';
import Reveal from './Reveal';
import ResponsivePicture from './ResponsivePicture';
import styles from './Cta.module.css';

export default function Cta() {
  const { open } = useBookingModal();

  return (
    <section className={styles.section} aria-label="Забронировать">
      <div className={styles.bg} aria-hidden="true">
        <ResponsivePicture
          image={APARTMENT.images.hero}
          alt=""
          className={styles.bgImg}
          sizes="100vw"
        />
      </div>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.content}>
        <Reveal as="h2" className={styles.title} y={24}>
          Забронируйте<br /><em>R14-APART</em>
        </Reveal>
        <Reveal as="p" className={styles.sub} delay={0.2} y={20}>
          Онлайн-оплата · Подтверждение за 5 минут · Заезд 24/7
        </Reveal>
        <Reveal className={styles.actions} delay={0.3} y={20}>
          <button
            type="button"
            className={styles.btnSolid}
            onClick={() => {
              trackBookingOpen();
              open();
            }}
          >
            Открыть форму бронирования
          </button>
          <a href={`tel:${APARTMENT.phone.replace(/\s/g, '')}`} className={styles.btnOutline} onClick={trackPhone}>
            Позвонить нам
          </a>
        </Reveal>
      </div>
    </section>
  );
}
