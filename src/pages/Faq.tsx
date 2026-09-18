import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, SearchX } from 'lucide-react';
import { splitWords } from '@/lib/split';
import SectionEyebrow from '@/components/SectionEyebrow';
import MagneticButton from '@/components/MagneticButton';
import FeaturedQuestion from '@/components/faq/FeaturedQuestion';
import FaqGroup from '@/components/faq/FaqGroup';
import { FEATURED_FAQ, FAQ_GROUPS, matchesQuery } from '@/components/faq/data';

gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * FAQ (`/faq`) — featured verbatim real-estate/debt question, grouped
 * accordions with one-open-at-a-time, and a live search filter.
 */
export default function Faq() {
  const [query, setQuery] = useState('');
  const headRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLHeadingElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  // Hero H1 — word-split masked reveal (runs once the page wipe clears)
  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const split = splitWords(head);
    const tween = gsap.fromTo(
      split.targets,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.55 }
    );
    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  // CTA strip h3 — word-split on scroll
  useEffect(() => {
    const head = ctaRef.current;
    const root = ctaSectionRef.current;
    if (!head || !root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  // Live search filter
  const featuredVisible = useMemo(() => matchesQuery(FEATURED_FAQ, query), [query]);
  const filteredGroups = useMemo(
    () =>
      FAQ_GROUPS.map((group) => ({
        label: group.label,
        items: group.items.filter((item) => matchesQuery(item, query)),
      })),
    [query]
  );
  const totalResults =
    (featuredVisible ? 1 : 0) + filteredGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      {/* §1 — Page hero with search */}
      <section className="vault-gradient relative flex min-h-[45vh] items-center overflow-hidden">
        <div className="container-rw relative py-20 text-center">
          <SectionEyebrow center>Frequently Asked Questions</SectionEyebrow>
          <h1
            ref={headRef}
            className="mx-auto mt-6 max-w-3xl font-display text-[clamp(38px,5vw,64px)] font-light leading-[1.04] tracking-[-0.015em] text-ivory"
          >
            Answers, before <em className="gem-text italic">you ask.</em>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="mx-auto mt-6 max-w-[48ch] font-sans text-[17px] leading-[1.7] text-parchment"
          >
            How we work, who we serve, and where real estate and debt fit inside a true wealth
            blueprint.
          </motion.p>

          {/* Live search field */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
            className="mx-auto mt-9 max-w-[480px]"
          >
            <label className="flex items-center gap-3 rounded-full border border-stone-line bg-basalt px-6 py-4 transition-colors duration-300 focus-within:border-[rgba(201,24,74,0.5)]">
              <Search size={18} strokeWidth={1.5} className="shrink-0 text-champagne" />
              <span className="sr-only">Search questions</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions…"
                style={{ caretColor: '#C9184A' }}
                className="w-full bg-transparent font-sans text-[15px] text-ivory outline-none placeholder:text-taupe"
              />
            </label>
          </motion.div>
        </div>
      </section>

      {/* §2 — Featured question (verbatim real-estate/debt) */}
      <section className="pt-16">
        <div className="container-rw">
          <div className="mx-auto max-w-[860px]">
            <AnimatePresence initial={false}>
              {featuredVisible && (
                <motion.div
                  key="featured"
                  layout
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.3, ease: EASE } }}
                  className="overflow-hidden"
                >
                  <FeaturedQuestion question={FEATURED_FAQ.question} answer={FEATURED_FAQ.answer} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* §3 — FAQ groups */}
      <section className="py-16">
        <div className="container-rw">
          <div className="mx-auto max-w-[860px]">
            {totalResults === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center gap-4 py-16 text-center"
              >
                <SearchX size={28} strokeWidth={1.5} className="text-taupe" />
                <p className="font-display text-2xl font-medium text-ivory">No matching questions</p>
                <p className="max-w-[44ch] font-sans text-[15px] leading-relaxed text-taupe">
                  Try a different search term — or book a consultation and ask us directly.
                </p>
              </motion.div>
            ) : (
              filteredGroups.map((group, gi) => (
                <div key={group.label}>
                  {gi > 0 && (
                    <img
                      src="/faq-gem-line.svg"
                      alt=""
                      aria-hidden
                      className="mx-auto my-14 w-full max-w-[560px] opacity-80"
                    />
                  )}
                  <FaqGroup
                    label={group.label}
                    items={group.items}
                    dimmed={query.trim() !== '' && group.items.length === 0}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* §4 — Still have questions (CTA strip) */}
      <section ref={ctaSectionRef} className="border-t border-stone-line py-24">
        <div className="container-rw text-center">
          <h3
            ref={ctaRef}
            className="mx-auto max-w-2xl font-display text-[clamp(26px,2.6vw,38px)] font-medium leading-[1.15] text-ivory"
          >
            Still have questions?
          </h3>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mx-auto mt-4 max-w-[46ch] font-sans text-[17px] leading-[1.7] text-parchment"
          >
            Every blueprint begins with a conversation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="mt-9"
          >
            <MagneticButton to="/contact" variant="primary" cursorLabel="Open">
              Book a Consultation
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </>
  );
}
