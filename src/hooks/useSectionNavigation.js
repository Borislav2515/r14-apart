import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return false;

  const navOffset = 80;
  const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  return true;
};

export function useSectionNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback((id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }

    scrollToSection(id);
  }, [location.pathname, navigate]);
}
