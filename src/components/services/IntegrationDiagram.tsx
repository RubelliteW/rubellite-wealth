import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Spoke {
  label: string;
  tooltip: string;
  /** Anchor position in the diamond, as percentage coords */
  x: number;
  y: number;
  isNew?: boolean;
}

const SPOKES: Spoke[] = [
  { label: 'Tax Strategy', tooltip: 'Structures tuned to minimize lifetime erosion.', x: 50, y: 4 },
  { label: 'Estate Planning', tooltip: 'Legacy transfer designed without friction.', x: 96, y: 50 },
  { label: 'Risk Management', tooltip: 'Protection sized to total exposure.', x: 50, y: 96 },
  {
    label: 'Real Estate & Debt Optimization',
    tooltip: 'Debt strategy aligned to estate & tax goals.',
    x: 4,
    y: 50,
    isNew: true,
  },
];

/**
 * Hub-and-spoke integration diagram: a slowly rotating faceted gem at the
 * center, champagne spokes connecting to four pillar nodes in a diamond.
 * Hovering a node lights its spoke ruby and reveals a tooltip.
 * Mobile: vertical list with the gem on top and connecting stubs.
 */
export default function IntegrationDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const gemRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Entrance: gem scales in, spokes draw outward, nodes pop
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      });
      tl.fromTo(
        gemRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.9, ease: 'back.out(1.5)' }
      );
      tl.fromTo(
        root.querySelectorAll('.spoke-line'),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15 },
        '-=0.4'
      );
      tl.fromTo(
        root.querySelectorAll('.spoke-node'),
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.1 },
        '-=0.7'
      );

      // Continuous: gem slow rotation + ruby glow breathe
      gsap.to(gemRef.current, { rotation: 360, duration: 30, ease: 'none', repeat: -1 });
      gsap.to(glowRef.current, {
        opacity: 0.85,
        scale: 1.15,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* Desktop diamond */}
      <div className="relative mx-auto hidden h-[520px] max-w-[860px] md:block">
        {/* Connecting spokes */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {SPOKES.map((s, i) => (
            <line
              key={s.label}
              x1="50"
              y1="50"
              x2={s.x}
              y2={s.y}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
              className="spoke-line transition-[stroke] duration-300"
              stroke={hovered === i ? '#C9184A' : 'rgba(214,185,140,0.35)'}
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: hovered === i ? 1.5 : 1 }}
            />
          ))}
        </svg>

        {/* Center gem */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            ref={glowRef}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
            style={{ background: 'radial-gradient(closest-side, rgba(201,24,74,0.28), transparent 70%)' }}
          />
          <img ref={gemRef} src="/logo-facet.svg" alt="" className="relative h-32 w-32 lg:h-40 lg:w-40" />
        </div>

        {/* Nodes */}
        {SPOKES.map((s, i) => (
          <div
            key={s.label}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="spoke-node relative">
              <button
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setHovered(hovered === i ? null : i)}
              className={`relative flex items-center gap-2 whitespace-nowrap rounded-full border bg-basalt px-5 py-2.5 font-sans text-[13px] font-medium transition-colors duration-300 ${
                hovered === i ? 'border-rubellite/60 text-ivory' : 'border-stone-line text-parchment hover:text-ivory'
              }`}
              aria-describedby={`spoke-tip-${i}`}
            >
              {s.label}
              {s.isNew && <span className="h-1.5 w-1.5 rounded-full bg-rubellite" aria-hidden />}
            </button>
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  id={`spoke-tip-${i}`}
                  role="tooltip"
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 4 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute z-10 w-max max-w-[240px] whitespace-normal rounded-lg border border-stone-line bg-umber px-4 py-2.5 text-center font-sans text-[12px] leading-relaxed text-parchment shadow-2xl ${
                    s.y > 60
                      ? 'bottom-full left-1/2 mb-3 -translate-x-1/2'
                      : 'left-1/2 top-full mt-3 -translate-x-1/2'
                  }`}
                >
                  {s.tooltip}
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile vertical list */}
      <div className="flex flex-col items-center md:hidden">
        <img src="/logo-facet.svg" alt="" className="h-24 w-24" />
        {SPOKES.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center">
            <span
              aria-hidden
              className={`my-1 h-8 w-px ${hovered === i ? 'bg-rubellite' : 'bg-[rgba(214,185,140,0.35)]'}`}
            />
            <button
              type="button"
              onClick={() => setHovered(hovered === i ? null : i)}
              className={`flex items-center gap-2 rounded-full border bg-basalt px-5 py-2.5 font-sans text-[13px] font-medium transition-colors ${
                hovered === i ? 'border-rubellite/60 text-ivory' : 'border-stone-line text-parchment'
              }`}
            >
              {s.label}
              {s.isNew && <span className="h-1.5 w-1.5 rounded-full bg-rubellite" aria-hidden />}
            </button>
            <AnimatePresence>
              {hovered === i && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2 max-w-[240px] text-center font-sans text-[12px] leading-relaxed text-taupe"
                >
                  {s.tooltip}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
