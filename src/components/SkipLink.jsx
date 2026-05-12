import { useSectionNavigation } from '../hooks/useSectionNavigation';

export default function SkipLink() {
  const goToSection = useSectionNavigation();

  return (
    <a
      href="/"
      className="skipLink"
      onClick={(e) => {
        e.preventDefault();
        goToSection('hero');
      }}
    >
      Перейти к контенту
    </a>
  );
}
