import { useEffect } from 'react';

/**
 * Adds `.is-visible` to every `.reveal` element inside `rootRef` once it
 * scrolls into view. Falls back to showing everything immediately when
 * IntersectionObserver is unavailable or the user prefers reduced motion.
 *
 * Pair with the `.reveal` / `.reveal.is-visible` classes in globals.css.
 */
export function useReveal(rootRef, { threshold = 0.14, rootMargin = '0px 0px -60px 0px' } = {}) {
  useEffect(() => {
    const root = rootRef?.current || document;
    const elements = Array.from(root.querySelectorAll('.reveal'));
    if (elements.length === 0) return undefined;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef, threshold, rootMargin]);
}

export default useReveal;
