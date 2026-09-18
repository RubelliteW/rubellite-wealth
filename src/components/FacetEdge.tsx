import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FacetEdgeProps {
  className?: string;
  /** px size of the SVG cluster */
  size?: number;
}

/**
 * Decorative cluster of thin-stroked triangular facets.
 * Slowly rotates (40s/rev) and parallaxes at 0.3x scroll speed.
 * Purely decorative — aria-hidden.
 */
export default function FacetEdge({ className = '', size = 260 }: FacetEdgeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.to(el.querySelector('svg'), {
        rotation: 360,
        duration: 40,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      });
      gsap.to(el, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <g stroke="rgba(214,185,140,0.18)" strokeWidth="1" strokeLinejoin="round">
          <polygon points="100,18 158,64 42,64" />
          <polygon points="42,64 100,18 100,120" />
          <polygon points="158,64 100,18 100,120" />
          <polygon points="42,64 100,120 20,150" />
          <polygon points="158,64 100,120 180,150" />
          <polygon points="100,120 180,150 100,186 20,150" />
        </g>
      </svg>
    </div>
  );
}
