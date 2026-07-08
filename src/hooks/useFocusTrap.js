import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusable = (container) => {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null
  );
};

/**
 * Traps Tab focus inside containerRef while active, moves focus in on open,
 * closes on Escape, and restores focus to whatever had it beforehand on close.
 * Note: cannot trap focus inside a same-origin-restricted iframe's own document
 * (e.g. a third-party widget) — only the surrounding chrome is covered.
 */
export function useFocusTrap(active, containerRef, { onClose, initialFocusRef } = {}) {
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    previouslyFocused.current = document.activeElement;

    const toFocus = initialFocusRef?.current || getFocusable(containerRef.current)[0];
    toFocus?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = getFocusable(containerRef.current);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [active]);
}
