import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitWords } from '@/lib/split';

gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Team page §4 — Partnership statement band.
 * Word-split statement reveal; monogram chips slide in from opposite sides;
 * connecting hairline draws; the ruby facet pops with a spring then slow-rotates.
 */
export default function PartnershipStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const stmtRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stmt = stmtRef.current;
    if (!root || !stmt) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = splitWords(stmt);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.targets,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.05,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        }
      );
    }, root);
    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden border-y border-stone-line bg-umber py-28">
      <div className="container-rw">
        <div className="mx-auto max-w-[820px] text-center">
          <p
            ref={stmtRef}
            className="font-display text-[clamp(26px,3vw,38px)] font-normal leading-[1.3] text-ivory"
          >
            One advises the <em className="italic">structure.</em> The other architects the{' '}
            <em className="italic">leverage.</em> Together, they deliver a blueprint no single
            discipline could.
          </p>

          {/* Monogram chips flanking a ruby facet, connected by a hairline */}
          <div className="mt-12 flex items-center justify-center gap-5">
            <motion.span
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/50 font-display text-lg text-champagne"
            >
              N
            </motion.span>
            <motion.span
              aria-hidden
              className="hairline-champagne w-14 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.35 }}
              className="flex"
            >
              <motion.img
                src="/logo-facet.svg"
                alt=""
                className="h-9 w-9"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
              />
            </motion.span>
            <motion.span
              aria-hidden
              className="hairline-champagne w-14 origin-right"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            />
            <motion.span
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/50 font-display text-lg text-champagne"
            >
              S
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}
