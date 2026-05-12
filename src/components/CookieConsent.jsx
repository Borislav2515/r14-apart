import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'r14apart-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    setVisible(!localStorage.getItem(STORAGE_KEY));
  }, []);

  const saveConsent = (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setVisible(false);
    setSettingsOpen(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      acceptedAt: new Date().toISOString(),
    });
  };

  const confirmSettings = () => {
    saveConsent({
      necessary: true,
      ...preferences,
      acceptedAt: new Date().toISOString(),
    });
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  if (!visible) return null;

  return (
    <>
      <div className={styles.banner} role="region" aria-label="Уведомление о cookies">
        <p>
          Используем cookies для работы сайта, аналитики и улучшения сервиса.
          Подробнее — в <Link to="/cookies">политике использования cookie</Link>.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={() => setSettingsOpen(true)}>
            Настроить
          </button>
          <button type="button" onClick={acceptAll}>
            Принять
          </button>
        </div>
      </div>

      {settingsOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
          <div className={styles.modal}>
            <h2 id="cookie-settings-title">Настройки cookie</h2>
            <p className={styles.modalText}>
              Выберите, какие cookies можно использовать. Обязательные cookies нужны для работы сайта и не отключаются.
            </p>

            <div className={styles.options}>
              <label className={styles.option}>
                <input type="checkbox" checked disabled />
                <span>
                  <strong>Обязательные</strong>
                  <small>Работа сайта, безопасность, сохранение вашего выбора.</small>
                </span>
              </label>

              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference('analytics')}
                />
                <span>
                  <strong>Аналитические</strong>
                  <small>Помогают понимать, какие разделы сайта полезны гостям.</small>
                </span>
              </label>

              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => togglePreference('marketing')}
                />
                <span>
                  <strong>Маркетинговые</strong>
                  <small>Могут использоваться для оценки эффективности рекламы.</small>
                </span>
              </label>
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.secondary} onClick={() => setSettingsOpen(false)}>
                Назад
              </button>
              <button type="button" onClick={confirmSettings}>
                Подтвердить выбор
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
