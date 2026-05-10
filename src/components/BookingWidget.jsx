import { useEffect } from 'react';

const SCRIPT_SRC = 'https://homereserve.ru/widget.js';
const TOKEN = 'lJ9CQtdlv9';

let scriptPromise;

function ensureScript() {
  if (window.homereserve?.initWidgetSearch) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      setTimeout(resolve, 250);
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = SCRIPT_SRC;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

  return scriptPromise;
}

function initWidgetIn(containerId, tag) {
  const target = document.getElementById(containerId);
  if (!target || !window.homereserve?.initWidgetSearch) return false;

  const currentMain = document.getElementById('hr-widget');
  const mainWasTarget = currentMain === target;
  const tempId = '__hr_widget_temp__';

  if (currentMain && !mainWasTarget) currentMain.id = tempId;
  target.id = 'hr-widget';
  window.homereserve.initWidgetSearch({ token: TOKEN, tag });
  target.id = containerId;
  if (currentMain && !mainWasTarget) currentMain.id = 'hr-widget';

  return true;
}

export default function BookingWidget({ containerId, tag = 'site' }) {
  useEffect(() => {
    let stopped = false;
    let retries = 0;

    const boot = async () => {
      await ensureScript();
      const tryInit = () => {
        if (stopped) return;
        if (initWidgetIn(containerId, tag)) return;
        retries += 1;
        if (retries < 20) setTimeout(tryInit, 250);
      };
      tryInit();
    };

    boot();
    return () => {
      stopped = true;
    };
  }, [containerId, tag]);

  return <div id={containerId} aria-label="Форма бронирования" />;
}
