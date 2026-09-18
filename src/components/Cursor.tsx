import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor: 8px ruby dot + 36px ivory ring (mix-blend-difference).
 * Expands to 64px over interactive elements, with optional label
 * via data-cursor="Label". Disabled on touch devices.
 */
export default function Cursor() {
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        'a, button, [role="button"], [data-cursor]'
      );
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute('data-cursor'));
      } else {
        setHovering(false);
        setLabel(null);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* ruby dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-rubellite"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      {/* ivory ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] flex items-center justify-center rounded-full border border-ivory mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 64 : 36,
          height: hovering ? 64 : 36,
          backgroundColor: hovering && label ? 'rgba(244,239,232,0.92)' : 'rgba(244,239,232,0)',
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {label && hovering && (
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-obsidian">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
