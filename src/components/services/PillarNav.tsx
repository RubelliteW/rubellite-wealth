import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface PillarNavSection {
  id: string;
  label: string;
  isNew?: boolean;
}

interface PillarNavProps {
  sections: PillarNavSection[];
}

export const PILLAR_NAV_OFFSET = 160;

export function scrollToPillar(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - PILLAR_NAV_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Sticky sub-navigation below the navbar with ScrollTrigger scroll-spy.
 * Active tab: ivory text + ruby underline gliding via layoutId spring.
 */
export default function PillarNav({ sections }: PillarNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const triggers = sections.map((s) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setActive(s.id);
        },
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, [sections]);

  return (
    <div className="sticky top-20 z-40 border-y border-stone-line bg-basalt/85 backdrop-blur-xl">
      <div className="container-rw">
        <nav
          className="flex items-center gap-1 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Pillar sections"
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToPillar(s.id)}
                className={`relative shrink-0 whitespace-nowrap px-4 py-3.5 font-sans text-[13px] font-medium transition-colors duration-300 md:px-5 ${
                  isActive ? 'text-ivory' : 'text-taupe hover:text-parchment'
                }`}
              >
                <span className="flex items-center gap-2">
                  {s.label}
                  {s.isNew && <span className="h-1.5 w-1.5 rounded-full bg-rubellite" aria-hidden />}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="pillar-nav-underline"
                    className="absolute inset-x-4 bottom-0 h-[2px] bg-rubellite md:inset-x-5"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
