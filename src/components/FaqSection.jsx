import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ } from '../data/apartment';
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
        <motion.div
          className={styles.icon}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-hidden="true"
        >
          +
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <p className={styles.answer} itemProp="text">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId(v => v === id ? null : id);

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <motion.p
        className={styles.label}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
      >
        Вопросы и ответы
      </motion.p>
      <motion.h2
        className={styles.title} id="faq-heading"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
      >
        Часто<br /><em>спрашивают</em>
      </motion.h2>

      <div className={styles.list}>
        {FAQ.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.07 }}
          >
            <FaqItem item={item} isOpen={openId === item.id} onToggle={() => toggle(item.id)} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
