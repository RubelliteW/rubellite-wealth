import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
  cursorLabel?: string;
}

/**
 * Pill button with magnetic hover — attracts toward the cursor
 * within a 24px radius. Primary = ruby gem gradient, ghost = hairline.
 */
export default function MagneticButton({
  to,
  children,
  variant = 'primary',
  className = '',
  cursorLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < rect.width / 2 + 24) {
      x.set(dx * 0.28);
      y.set(dy * 0.28);
    } else {
      x.set(0);
      y.set(0);
    }
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="inline-block"
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        ref={ref}
        to={to}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} ${className}`}
        {...(cursorLabel ? { 'data-cursor': cursorLabel } : {})}
      >
        {children}
      </Link>
    </motion.div>
  );
}
