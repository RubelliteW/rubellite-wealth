import { useEffect, useRef, useState } from 'react';

interface IconDrawProps {
  /** Public path to a stroke-based SVG asset (e.g. /pillar-tax.svg) */
  src: string;
  /** Rendered size in px */
  size?: number;
  className?: string;
  /** Extra delay before the draw starts (seconds) */
  delay?: number;
}

/**
 * Loads a stroke-based SVG, inlines it, normalizes every geometry with
 * pathLength=1, then plays a stroke-dashoffset "self-drawing" animation
 * once the icon scrolls into view. Falls back to a plain <img>.
 */
export default function IconDraw({ src, size = 96, className = '', delay = 0 }: IconDrawProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(src)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        if (alive) setSvg(text);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !svg) return;
    const shapes = el.querySelectorAll<SVGGeometryElement>(
      'path, circle, polygon, polyline, line, rect, ellipse'
    );
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    shapes.forEach((shape, i) => {
      shape.setAttribute('pathLength', '1');
      if (reduced) return;
      shape.style.strokeDasharray = '1';
      shape.style.strokeDashoffset = '1';
      shape.style.transition = `stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) ${delay + i * 0.06}s`;
    });
    if (reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          shapes.forEach((shape) => {
            shape.style.strokeDashoffset = '0';
          });
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [svg, delay]);

  if (failed) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`inline-block leading-none [&>svg]:h-full [&>svg]:w-full ${className}`}
      style={{ width: size, height: size, opacity: svg ? 1 : 0, transition: 'opacity 0.4s ease' }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
