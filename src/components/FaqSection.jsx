import { useState } from 'react';
import { FAQ } from '../data/apartment';
import Reveal from './Reveal';
import styles from './FaqSection.module.css';

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      className={styles.item}
      itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
    >
      <button
        className={styles.question}
        onClick={onToggle}
        aria-expanded={isOpen}
        itemProp="name"
      >
        <span>{item.q}</span>
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`} aria-hidden="true">
          +
        </span>
      </button>
      <div
        className={`${styles.answerWrap} ${isOpen ? styles.answerOpen : ''}`}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <p className={styles.answer} itemProp="text">{item.a}</p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(v => v === id ? null : id);

  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <Reveal as="p" className={styles.label} y={30}>
        Вопросы и ответы
      </Reveal>
      <Reveal as="h2" className={styles.title} id="faq-heading" delay={0.1} y={30}>
        Часто<br /><em>спрашивают</em>
      </Reveal>

      <div className={styles.list}>
        {FAQ.map((item, i) => (
          <Reveal
            key={item.id}
            delay={i * 0.07}
            y={24}
          >
            <FaqItem item={item} isOpen={openId === item.id} onToggle={() => toggle(item.id)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
