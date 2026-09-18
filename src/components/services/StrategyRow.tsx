import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import IconDraw from './IconDraw';

gsap.registerPlugin(ScrollTrigger);

interface StrategyRowProps {
  numeral: string;
  title: string;
  body: string;
  outcomes: string[];
  icon: string;
}

/**
 * Full-width strategy row: oversized ghost numeral + self-drawing icon
 * (scrubbed), title/body, and a "planning outcomes" mini-list that pops
 * in with a spring stagger. Hover lifts the row and tints the numeral ruby.
 */
export default function StrategyRow({ numeral, title, body, outcomes, icon }: StrategyRowProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Ghost numeral: scrub fade + scale through its viewport band
      gsap.fromTo(
        root.querySelector('.strategy-numeral'),
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 95%', end: 'top 45%', scrub: true },
        }
      );

      // Title + body
      gsap.fromTo(
        root.querySelector('.strategy-title'),
        { opacity: 0, x: -28 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        }
      );
      gsap.fromTo(
        root.querySelector('.strategy-body'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        }
      );

      // Outcomes pop with spring stagger
      gsap.fromTo(
        root.querySelectorAll('.strategy-outcome'),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.8)',
          stagger: 0.08,
          scrollTrigger: { trigger: root.querySelector('.strategy-outcomes'), start: 'top 82%', once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="group grid gap-10 border-t border-stone-line pt-14 transition-transform duration-500 ease-out md:grid-cols-12 md:hover:-translate-y-1"
    >
      {/* Ghost numeral + icon */}
      <div className="md:col-span-3">
        <div
          aria-hidden
          className="strategy-numeral font-display text-[clamp(72px,8vw,120px)] font-light leading-none text-[rgba(244,239,232,0.07)] transition-colors duration-500 group-hover:text-[rgba(201,24,74,0.28)]"
          style={{ fontFeatureSettings: '"ss01"' }}
        >
          {numeral}
        </div>
        <div className="mt-6">
          <IconDraw src={icon} size={64} />
        </div>
      </div>

      {/* Title + verbatim body */}
      <div className="md:col-span-5">
        <h3 className="strategy-title font-display text-[clamp(24px,2.4vw,32px)] font-medium leading-tight text-ivory">
          {title}
        </h3>
        <p className="strategy-body mt-5 max-w-[56ch] font-sans text-[16px] leading-[1.7] text-parchment">
          {body}
        </p>
      </div>

      {/* Planning outcomes */}
      <div className="md:col-span-4">
        <div className="eyebrow strategy-body">Planning outcomes</div>
        <ul className="strategy-outcomes mt-5 space-y-3.5">
          {outcomes.map((o) => (
            <li key={o} className="strategy-outcome flex items-start gap-3">
              <span className="mt-[2px] shrink-0 font-sans text-[12px] leading-[1.7] text-champagne" aria-hidden>
                ▸
              </span>
              <span className="font-sans text-[14px] leading-[1.65] text-parchment">{o}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
