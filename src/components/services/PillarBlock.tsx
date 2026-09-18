import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionEyebrow from '@/components/SectionEyebrow';
import { splitWords } from '@/lib/split';
import IconDraw from './IconDraw';

gsap.registerPlugin(ScrollTrigger);

export interface PillarBullet {
  /** Bolded lead-in (verbatim copy) */
  lead?: string;
  text: string;
}

interface PillarBlockProps {
  id: string;
  numeral: string;
  eyebrow: string;
  title: ReactNode;
  paragraphs: string[];
  bullets: PillarBullet[];
  icon: string;
  /** Mirror the layout (visual left, text right) */
  mirrored?: boolean;
  /** Flagship treatment: umber bg, ruby border, badge, glow pulse */
  flagship?: boolean;
  /** Optional CTA row rendered under the bullets */
  children?: ReactNode;
}

/**
 * One full-width pillar detail block: eyebrow + word-split h2, body,
 * champagne-marker bullets, and a large self-drawing icon anchored on a
 * rotating facet-cut basalt panel.
 */
export default function PillarBlock({
  id,
  numeral,
  eyebrow,
  title,
  paragraphs,
  bullets,
  icon,
  mirrored = false,
  flagship = false,
  children,
}: PillarBlockProps) {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const head = headRef.current;
    const split = head ? splitWords(head) : null;

    const ctx = gsap.context(() => {
      // Headline word-split masked reveal
      if (head && split) {
        gsap.fromTo(
          split.targets,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.05,
            scrollTrigger: { trigger: head, start: 'top 78%', once: true },
          }
        );
      }

      // Body paragraphs fade up
      gsap.fromTo(
        root.querySelectorAll('.pillar-body'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.15,
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        }
      );

      // Bullets slide in from the left, markers pop
      gsap.fromTo(
        root.querySelectorAll('.pillar-bullet'),
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'back.out(1.6)',
          stagger: 0.08,
          scrollTrigger: { trigger: root.querySelector('.pillar-bullets'), start: 'top 80%', once: true },
        }
      );

      // Facet panel settles into place
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { rotation: -4 },
          {
            rotation: 0,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: root, start: 'top 70%', once: true },
          }
        );
      }

      // Flagship: one-time ruby border-glow pulse
      if (flagship) {
        gsap.fromTo(
          root,
          { boxShadow: 'inset 0 0 0 rgba(201,24,74,0)' },
          {
            keyframes: [
              { boxShadow: 'inset 0 0 90px rgba(201,24,74,0.16)', duration: 0.9 },
              { boxShadow: 'inset 0 0 0 rgba(201,24,74,0)', duration: 1.1 },
            ],
            scrollTrigger: { trigger: root, start: 'top 65%', once: true },
          }
        );
      }
    }, root);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [flagship]);

  return (
    <section
      id={id}
      ref={rootRef}
      className={`relative overflow-hidden py-24 ${flagship ? 'border-l-[3px] border-rubellite bg-umber' : ''}`}
    >
      <div className="container-rw grid items-center gap-12 md:grid-cols-12 md:gap-16">
        {/* Text column */}
        <div className={`md:col-span-7 ${mirrored ? 'md:order-2' : ''}`}>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-light tracking-[0.3em] text-taupe" aria-hidden>
              {numeral}
            </span>
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            {flagship && (
              <span className="inline-flex items-center gap-2 rounded-full border border-rubellite/40 bg-ruby-deep/20 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ruby-glow">
                <span className="h-1.5 w-1.5 rounded-full bg-rubellite" aria-hidden />
                New Core Pillar
              </span>
            )}
          </div>
          <h2
            ref={headRef}
            className="mt-6 font-display text-[clamp(30px,3.6vw,52px)] font-normal leading-[1.08] text-ivory"
          >
            {title}
          </h2>
          {paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="pillar-body mt-6 max-w-[62ch] font-sans text-[17px] leading-[1.7] text-parchment">
              {p}
            </p>
          ))}
          <ul className="pillar-bullets mt-8 space-y-4">
            {bullets.map((b) => (
              <li key={b.text.slice(0, 28)} className="pillar-bullet flex items-start gap-3">
                <span className="mt-[2px] shrink-0 font-sans text-[13px] leading-[1.7] text-champagne" aria-hidden>
                  ▸
                </span>
                <span className="font-sans text-[15px] leading-[1.7] text-parchment">
                  {b.lead && <strong className="font-semibold text-ivory">{b.lead} </strong>}
                  {b.text}
                </span>
              </li>
            ))}
          </ul>
          {children}
        </div>

        {/* Visual column */}
        <div className={`relative hidden md:col-span-5 md:block ${mirrored ? 'md:order-1' : ''}`}>
          <div
            ref={panelRef}
            className="facet-notch facet-sheen relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center border border-stone-line bg-basalt"
          >
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                background: flagship
                  ? 'radial-gradient(420px 300px at 50% 40%, rgba(201,24,74,0.12), transparent 70%)'
                  : 'radial-gradient(420px 300px at 50% 40%, rgba(214,185,140,0.06), transparent 70%)',
              }}
            />
            <IconDraw src={icon} size={120} />
          </div>
        </div>
      </div>
    </section>
  );
}
