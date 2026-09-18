import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitWords } from '@/lib/split';

gsap.registerPlugin(ScrollTrigger);

interface CTABandProps {
  headline?: string;
  /** Italic gradient phrase inside the headline */
  accent?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

/**
 * Shared closing band: umber bg + vault bloom, word-split headline,
 * ruby pill CTA + ghost secondary, mouse-tracked ruby bloom.
 */
export default function CTABand({
  headline = "Let's architect your",
  accent = 'wealth blueprint.',
  primaryLabel = 'Book a Consultation',
  primaryTo = '/contact',
  secondaryLabel = 'Explore the Four Pillars',
  secondaryTo = '/services',
}: CTABandProps) {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const head = headRef.current;
    if (!root || !head) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const split = splitWords(head);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.targets,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        }
      );
    }, root);

    // Mouse-tracked ruby bloom
    const bloom = bloomRef.current;
    const onMove = (e: MouseEvent) => {
      if (!bloom) return;
      const rect = root.getBoundingClientRect();
      gsap.to(bloom, {
        x: e.clientX - rect.left - 300,
        y: e.clientY - rect.top - 300,
        opacity: 0.15,
        duration: 0.6,
        ease: 'power2.out',
      });
    };
    const onLeave = () => {
      if (bloom) gsap.to(bloom, { opacity: 0, duration: 0.6 });
    };
    root.addEventListener('mousemove', onMove);
    root.addEventListener('mouseleave', onLeave);

    return () => {
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="vault-gradient relative overflow-hidden bg-umber py-28">
      <div
        ref={bloomRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-0"
        style={{ background: 'radial-gradient(300px 300px at center, rgba(201,24,74,0.5), transparent 70%)' }}
      />
      <div className="container-rw relative text-center">
        <h2
          ref={headRef}
          className="mx-auto max-w-3xl font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory"
        >
          {headline} <em className="gem-text italic">{accent}</em>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to={primaryTo} className="btn-primary" data-cursor="Open">
            {primaryLabel}
          </Link>
          <Link to={secondaryTo} className="btn-ghost">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
