import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Page-transition wipe: a ruby-gradient panel with a faceted gem at its
 * leading edge sweeps right-to-left across the viewport on route change
 * (and once on initial load — page load timelines start as it completes).
 */
export default function PageWipe() {
  const { pathname } = useLocation();
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  if (reduced) return null;

  return (
    <motion.div
      key={pathname}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90]"
      initial={{ x: '100%' }}
      animate={{ x: '-100%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0E0C0B 0%, #8E0F36 55%, #C9184A 100%)' }}
      >
        <img
          src="/logo-facet.svg"
          alt=""
          className="absolute left-6 top-1/2 h-12 w-12 -translate-y-1/2 opacity-80"
        />
      </div>
    </motion.div>
  );
}
