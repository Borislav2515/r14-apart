import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  x = 0,
  y = 32,
  immediate = false,
  className,
  style,
  children,
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'revealVisible' : ''} ${className ?? ''}`}
      style={{
        '--reveal-delay': `${delay}s`,
        '--reveal-x': `${x}px`,
        '--reveal-y': `${y}px`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
