import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const BookingModalContext = createContext(null);

/**
 * Owns the single HomeReserve widget instance's mount target. The hero and
 * the CTA-triggered modal each expose an empty "slot" div; whichever slot is
 * active is where the real (never-remounted) widget DOM node gets portaled,
 * so the third-party script only ever initializes once per page load.
 */
export function BookingModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [heroSlot, setHeroSlot] = useState(null);
  const [modalSlot, setModalSlot] = useState(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close, heroSlot, setHeroSlot, modalSlot, setModalSlot }),
    [isOpen, open, close, heroSlot, modalSlot]
  );

  return <BookingModalContext.Provider value={value}>{children}</BookingModalContext.Provider>;
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) throw new Error('useBookingModal must be used within BookingModalProvider');
  return ctx;
}
