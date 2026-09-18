import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GemStatProps {
  /** Numeric value to count up to */
  value: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  /** Numeral size classes — defaults to the stat-numeral scale */
  numeralClassName?: string;
  className?: string;
  duration?: number;
  /** Decimal places shown while counting (default 0) */
  decimals?: number;
}

/**
 * Large Fraunces numeral with gem gradient + label.
 * Counts up (GSAP snap) when scrolled into view.
 */
export default function GemStat({
  value,
  prefix = '',
  suffix = '',
  label,
  numeralClassName = 'text-[clamp(56px,8vw,120px)]',
  className = '',
  duration = 1.6,
  decimals = 0,
}: GemStatProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      num.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: value,
      duration,
      ease: 'power2.out',
      snap: { v: decimals > 0 ? 1 / 10 ** decimals : 1 },
      scrollTrigger: { trigger: root, start: 'top 85%', once: true },
      onUpdate: () => {
        num.textContent = `${prefix}${state.v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, prefix, suffix, duration, decimals]);

  return (
    <div ref={rootRef} className={className}>
      <div
        className={`gem-text font-display font-light leading-none ${numeralClassName}`}
        style={{ fontFeatureSettings: '"ss01"' }}
      >
        <span ref={numRef}>
          {prefix}0{suffix}
        </span>
      </div>
      {label && (
        <div className="mt-3 font-sans text-[13px] leading-relaxed tracking-wide text-taupe">{label}</div>
      )}
    </div>
  );
}
