import { useRef } from 'react';
import { useBookingModal } from '../context/BookingModalContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import styles from './BookingModal.module.css';

export default function BookingModal() {
  const { isOpen, close, setModalSlot } = useBookingModal();
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useFocusTrap(isOpen, panelRef, { onClose: close, initialFocusRef: closeBtnRef });

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Форма бронирования"
      >
        <button ref={closeBtnRef} type="button" className={styles.close} onClick={close} aria-label="Закрыть форму бронирования">
          <span />
          <span />
        </button>
        <p className={styles.eyebrow}>R14-APART</p>
        <h2 className={styles.title}>Забронировать</h2>
        <div ref={setModalSlot} className={styles.widgetSlot} />
      </div>
    </div>
  );
}
