import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountStatProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  className?: string;
}

/**
 * Compact inline stat for hero strips: Fraunces gem-gradient numeral
 * (count-up on entry) above a small taupe caption.
 */
export default function CountStat({ value, prefix = '', suffix = '', label, className = '' }: CountStatProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      num.textContent = `${prefix}${value}${suffix}`;
      return;
    }
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: value,
      duration: 1.6,
      ease: 'power2.out',
      snap: { v: 1 },
      scrollTrigger: { trigger: root, start: 'top 90%', once: true },
      onUpdate: () => {
        num.textContent = `${prefix}${Math.round(state.v)}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, prefix, suffix]);

  return (
    <div ref={rootRef} className={className}>
      <span
        className="gem-text font-display text-[clamp(30px,3.4vw,44px)] font-light leading-none"
        style={{ fontFeatureSettings: '"ss01"' }}
      >
        <span ref={numRef}>
          {prefix}0{suffix}
        </span>
      </span>
      <span className="mt-2 block font-sans text-[12px] tracking-wide text-taupe">{label}</span>
    </div>
  );
}
