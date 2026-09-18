import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionEyebrow from '@/components/SectionEyebrow';
import GemStat from '@/components/GemStat';
import FacetEdge from '@/components/FacetEdge';
import CTABand from '@/components/CTABand';
import TeamCard from '@/components/TeamCard';
import { splitChars, splitWords } from '@/lib/split';
import { TEAM } from '@/lib/team';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'expo.out';
const FM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Section 1 — Page Hero (70vh)                                        */
/* ------------------------------------------------------------------ */
function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const hairlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const h1 = h1Ref.current;
    if (!root || !h1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = splitChars(h1);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
      // background image settles 1.06 -> 1 over 1.8s on load
      tl.fromTo(imgRef.current, { scale: 1.06 }, { scale: 1, duration: 1.8 }, 0)
        // H1 char-split masked reveal
        .fromTo(
          split.targets,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.012 },
          0.1
        )
        // eyebrow + sub stagger up 20px after headline
        .fromTo(
          [eyebrowRef.current, subRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          '-=0.45'
        )
        // champagne hairline draws under the H1 (delay 0.5s, 1.2s)
        .fromTo(hairlineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, 0.5);
    }, root);
    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative -mt-20 flex min-h-[70dvh] items-end overflow-hidden">
      {/* office backdrop at 0.30 opacity */}
      <img
        ref={imgRef}
        src="/about-office.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      {/* obsidian gradient overlay — solid bottom 80%, transparent top */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, #0E0C0B 0%, rgba(14,12,11,0.88) 45%, rgba(14,12,11,0.4) 75%, rgba(14,12,11,0.15) 100%)',
        }}
      />
      {/* vault bloom top-right */}
      <div className="vault-gradient absolute inset-0" aria-hidden />

      <div className="container-rw relative z-10 pb-24 pt-44">
        <div ref={eyebrowRef}>
          <SectionEyebrow>ABOUT RUBELLITE WEALTH</SectionEyebrow>
        </div>
        <h1
          ref={h1Ref}
          className="mt-8 max-w-[16ch] font-display text-[clamp(40px,5.4vw,76px)] font-light leading-[1.04] tracking-[-0.015em] text-ivory"
        >
          A firm built on <em className="gem-text italic">both sides of the balance sheet.</em>
        </h1>
        <span ref={hairlineRef} className="hairline-champagne mt-8 block w-40 origin-left" />
        <p className="mt-8 max-w-[52ch] font-sans text-[17px] leading-[1.7] text-parchment" ref={subRef}>
          Rubellite Wealth was founded by Nick Sidhu and Swarn Sidhu to give business owners,
          incorporated professionals, and high-net-worth families something rare: a single
          blueprint where assets and liabilities are designed together.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — The Premise (sticky editorial split)                    */
/* ------------------------------------------------------------------ */
function Premise() {
  const rootRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const parasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const h2 = h2Ref.current;
    if (!root || !h2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = splitWords(h2);
    const ctx = gsap.context(() => {
      // sticky h2 word-splits in on entry
      gsap.fromTo(
        split.targets,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.06,
          scrollTrigger: { trigger: h2, start: 'top 80%', once: true },
        }
      );
      // right column paragraphs fade up 32px sequentially
      gsap.fromTo(
        parasRef.current?.children ?? [],
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.15,
          scrollTrigger: { trigger: parasRef.current, start: 'top 80%', once: true },
        }
      );
    }, root);
    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative py-16 md:py-28">
      <FacetEdge className="right-0 top-10 hidden lg:block" size={220} />
      <div className="container-rw grid grid-cols-1 gap-14 lg:grid-cols-12">
        {/* Sticky headline column */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[120px]">
            <SectionEyebrow>OUR PREMISE</SectionEyebrow>
            <h2
              ref={h2Ref}
              className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory"
            >
              Wealth plans fail when <em className="gem-text italic">liabilities are an afterthought.</em>
            </h2>
          </div>
        </div>

        {/* Editorial body column */}
        <div ref={parasRef} className="space-y-8 lg:col-span-7">
          <p className="font-sans text-[17px] leading-[1.75] text-parchment">
            <motion.span
              aria-hidden
              className="float-left mr-3 mt-1 font-display text-[64px] font-light leading-[0.78] text-rubellite"
              initial={{ scale: 1.5, opacity: 0, textShadow: '0 0 32px rgba(201,24,74,0.9)' }}
              whileInView={{ scale: 1, opacity: 1, textShadow: '0 0 0px rgba(201,24,74,0)' }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 1, ease: FM_EASE }}
            >
              M
            </motion.span>
            ost wealth advice treats real estate debt as a separate transaction — something handled
            by a broker, in isolation, after the &lsquo;real&rsquo; planning is done. Rubellite
            Wealth was founded to close that gap. Real estate is often a client&rsquo;s largest
            holding and greatest tax exposure, and the debt attached to it shapes everything:
            estate liquidity, corporate tax efficiency, asset protection, and generational
            transfer.
          </p>
          <p className="font-sans text-[17px] leading-[1.75] text-parchment">
            Nick Sidhu spent over a decade advising business owners across Canada on corporate
            restructuring, tax efficiency, and estate optimization. Swarn Sidhu spent 11+ years
            funding more than $2 Billion in real estate capital. Together, they built a firm where
            both disciplines operate as one — a holistic, proactive financial blueprint that
            eliminates inefficiencies, minimizes tax erosion, and protects generational wealth.
          </p>
          <p className="font-sans text-[17px] leading-[1.75] text-parchment">
            Today, Rubellite Wealth serves clients across Canada through four integrated pillars:
            Tax Strategy, Estate Planning, Risk Management, and Real Estate &amp; Debt
            Optimization.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — The $2B Quote (verbatim pull-quote feature)             */
/* ------------------------------------------------------------------ */
const QUOTE =
  'With over 11 years of experience and more than $2 Billion in funded mortgages, Swarn Sidhu brings an elite level of real estate asset structuring and debt optimization to Rubellite Wealth. We ensure your leverage, property holdings, and liability strategies directly align with your broader estate and tax goals.';

function QuoteBand() {
  const rootRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const quote = quoteRef.current;
    if (!root || !quote) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // word cascade tied to scroll progress through the section
      gsap.fromTo(
        quote.querySelectorAll('[data-quote-word]'),
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: { trigger: quote, start: 'top 78%', end: 'bottom 45%', scrub: true },
        }
      );
      // giant quote mark rotates -8deg -> 0 and fades in on entry
      gsap.fromTo(
        markRef.current,
        { rotation: -8, opacity: 0 },
        {
          rotation: 0,
          opacity: 0.9,
          duration: 1.2,
          ease: EASE,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        }
      );
      // ruby radial bloom breathes slowly (0.08 -> 0.14, 5s loop)
      gsap.fromTo(
        bloomRef.current,
        { opacity: 0.08 },
        { opacity: 0.14, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-umber py-24 md:py-32">
      {/* breathing ruby bloom */}
      <div
        ref={bloomRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(350px 350px at center, rgba(201,24,74,0.6), transparent 70%)' }}
      />
      <div className="container-rw relative">
        <div className="relative mx-auto max-w-[900px] text-center">
          {/* decorative quotation mark */}
          <div
            ref={markRef}
            aria-hidden
            className="gem-text pointer-events-none absolute -top-16 left-0 select-none font-display text-[120px] font-light leading-none md:-left-16 md:-top-20 md:text-[180px]"
          >
            &ldquo;
          </div>
          <blockquote
            ref={quoteRef}
            className="font-display text-[clamp(24px,2.6vw,34px)] font-normal italic leading-[1.5] text-ivory"
          >
            {QUOTE.split(' ').map((word, i) => (
              <span key={i} data-quote-word className="inline-block opacity-[0.12]">
                {word}
                {'\u00A0'}
              </span>
            ))}
          </blockquote>

          {/* GemStats side by side */}
          <div className="mt-16 flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-24">
            <GemStat
              value={2}
              prefix="$"
              suffix="B+"
              label="funded mortgages"
              numeralClassName="text-[clamp(48px,6vw,88px)]"
            />
            <GemStat
              value={11}
              suffix="+"
              label="years specialized experience"
              numeralClassName="text-[clamp(48px,6vw,88px)]"
            />
          </div>

          <span className="hairline-champagne mx-auto mt-14 block w-24" />
          <p className="mt-8 font-sans text-[13px] uppercase tracking-[0.18em] text-taupe">
            Swarn Sidhu · Principal Mortgage Broker, Rubellite Wealth
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — Values (3 cards with stroke-drawn champagne icons)      */
/* ------------------------------------------------------------------ */
function ValueIcon({ paths, delay = 0 }: { paths: string[]; delay?: number }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 64 64"
      fill="none"
      stroke="#D6B98C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1, delay: delay + i * 0.15, ease: FM_EASE }}
        />
      ))}
    </svg>
  );
}

const VALUES = [
  {
    title: 'Both Sides of the Ledger',
    body: 'Assets and liabilities are designed together. Leverage, liquidity, and liability strategy are core planning instruments — never afterthoughts.',
    // balance beam with two pans
    paths: ['M32 10v40', 'M14 18h36', 'M14 18l-8 15h16l-8-15z', 'M50 18l-8 15h16l-8-15z', 'M22 54h20'],
  },
  {
    title: 'Structure Before Product',
    body: 'We architect the corporate, estate, and debt structures first. Products serve the blueprint, never the reverse.',
    // architectural keystone / blueprint outline
    paths: ['M12 52V26l20-13 20 13v26', 'M12 52h40', 'M26 52V38h12v14', 'M32 13v8'],
  },
  {
    title: 'Generational Horizon',
    body: 'Every decision is measured against its impact decades forward — on heirs, on enterprises, on family security.',
    // horizon line beneath a faceted sun/gem
    paths: [
      'M32 32m-17 0a17 17 0 1 0 34 0a17 17 0 1 0 -34 0',
      'M32 23l7 9-7 9-7-9 7-9z',
      'M8 55h48',
    ],
  },
];

function Values() {
  return (
    <section className="py-16 md:py-28">
      <div className="container-rw">
        <div className="text-center">
          <SectionEyebrow center>WHAT WE STAND FOR</SectionEyebrow>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory">
            Principles cut <em className="gem-text italic">with precision.</em>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              className="facet-sheen rounded-2xl border border-stone-line bg-basalt p-8 transition-colors duration-300 hover:border-[rgba(201,24,74,0.5)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: FM_EASE }}
              whileHover={{ y: -6 }}
            >
              <ValueIcon paths={v.paths} delay={0.2 + i * 0.12} />
              <h3 className="mt-7 font-display text-[clamp(22px,2vw,30px)] font-medium text-ivory">
                {v.title}
              </h3>
              <p className="mt-4 font-sans text-[15px] leading-[1.7] text-parchment">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — Timeline (scroll-drawn hairline, spring nodes)          */
/* ------------------------------------------------------------------ */
const MILESTONES = [
  {
    year: '2013',
    text: 'Swarn Sidhu begins a specialized mortgage career that will fund over $2 Billion in real estate capital.',
  },
  {
    year: '2014',
    text: 'Nick Sidhu establishes his advisory practice serving business owners and incorporated professionals across Canada.',
  },
  {
    year: '2020s',
    text: 'A shared conviction forms: wealth planning must address both sides of the balance sheet.',
  },
  {
    year: 'Today',
    text: 'Rubellite Wealth unifies tax, estate, risk, and real estate debt optimization into one holistic blueprint.',
  },
];

function Timeline() {
  const rootRef = useRef<HTMLElement>(null);
  const lineHRef = useRef<HTMLSpanElement>(null);
  const lineVRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // hairline draws left -> right (desktop) / top -> bottom (mobile), scrubbed
      [lineHRef.current, lineVRef.current].forEach((line) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { scaleX: line === lineVRef.current ? 1 : 0, scaleY: line === lineVRef.current ? 0 : 1 },
          {
            scaleX: 1,
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top 78%', end: 'bottom 55%', scrub: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-16 md:py-28">
      <div className="container-rw">
        <SectionEyebrow>THE ARC</SectionEyebrow>
        <div className="relative mt-14">
          {/* horizontal hairline (desktop) */}
          <span
            ref={lineHRef}
            aria-hidden
            className="hairline-champagne absolute left-0 right-0 top-[7px] hidden origin-left md:block"
          />
          {/* vertical hairline (mobile) */}
          <span
            ref={lineVRef}
            aria-hidden
            className="hairline-champagne absolute bottom-2 left-[7px] top-[7px] block h-auto w-px origin-top md:hidden"
          />

          <div className="flex flex-col gap-12 md:grid md:grid-cols-4 md:gap-8">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="relative pl-10 md:pl-0 md:pt-12">
                {/* ruby node dot */}
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-[2px] block h-[15px] w-[15px] rounded-full border border-ruby-glow/60 bg-rubellite shadow-[0_0_18px_rgba(201,24,74,0.55)] md:left-0 md:top-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16, delay: i * 0.15 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.7, delay: i * 0.15 + 0.1, ease: FM_EASE }}
                >
                  <div className="font-display text-3xl font-light text-champagne">{m.year}</div>
                  <p className="mt-3 max-w-[34ch] font-sans text-[14px] leading-[1.7] text-taupe">
                    {m.text}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 6 — Leadership preview                                      */
/* ------------------------------------------------------------------ */
function Leadership() {
  return (
    <section className="py-16 md:py-28">
      <div className="container-rw">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>LEADERSHIP</SectionEyebrow>
            <h2 className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory">
              Meet the <em className="gem-text italic">founders.</em>
            </h2>
          </div>
          <Link to="/team" className="link-arrow shrink-0" data-cursor="View">
            Full leadership page
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {TEAM.map((member) => (
            <TeamCard key={member.id} member={member} large />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function About() {
  return (
    <>
      <Hero />
      <Premise />
      <QuoteBand />
      <Values />
      <Timeline />
      <Leadership />
      <CTABand
        headline="See what a"
        accent="complete blueprint looks like."
        primaryLabel="Book a Consultation"
        primaryTo="/contact"
        secondaryLabel="Meet the Team"
        secondaryTo="/team"
      />
    </>
  );
}
