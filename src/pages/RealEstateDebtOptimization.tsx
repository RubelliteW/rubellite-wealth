import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import SectionEyebrow from '@/components/SectionEyebrow';
import CTABand from '@/components/CTABand';
import FacetEdge from '@/components/FacetEdge';
import AccordionItem from '@/components/AccordionItem';
import MagneticButton from '@/components/MagneticButton';
import { splitWords } from '@/lib/split';
import CountStat from '@/components/services/CountStat';
import StrategyRow from '@/components/services/StrategyRow';

gsap.registerPlugin(ScrollTrigger);

const FACET_CLIP = 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)';
const FACET_CLIP_CLOSED = 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';

/** Section 1 — facet-clip hero with gem-abstract visual */
function PillarHero() {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const head = headRef.current;
    const split = head ? splitWords(head) : null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Breadcrumb + eyebrow fade down
      tl.fromTo(
        root.querySelector('.hero-breadcrumb'),
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' },
        0
      );

      // H1 word-split masked reveal
      if (split) {
        tl.fromTo(
          split.targets,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 },
          0.25
        );
      }

      // Sub + stats + CTA stagger up
      tl.fromTo(
        root.querySelectorAll('.hero-rise'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12 },
        0.65
      );

      // Image slides in from the right while the facet clip opens leftward
      tl.fromTo(
        imgRef.current,
        { x: 60 },
        { x: 0, duration: 0.9, ease: 'expo.out' },
        0.3
      );
      tl.fromTo(
        imgWrapRef.current,
        { clipPath: FACET_CLIP_CLOSED },
        { clipPath: FACET_CLIP, duration: 0.9, ease: 'expo.out' },
        0.3
      );
    }, root);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative -mt-20 overflow-hidden">
      {/* Vault bloom */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(1200px 600px at 70% -10%, rgba(201,24,74,0.10), transparent 60%)' }}
      />

      <div className="container-rw relative flex min-h-[80dvh] items-center pb-16 pt-32 lg:pb-24">
        <div className="w-full max-w-[640px] lg:w-7/12">
          <nav className="hero-breadcrumb font-sans text-[12px] tracking-wide text-taupe" aria-label="Breadcrumb">
            <Link to="/services" className="transition-colors hover:text-parchment">
              Services
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-ivory">Real Estate &amp; Debt Optimization</span>
          </nav>

          <SectionEyebrow className="mt-8">CORE PILLAR 04 · REAL ESTATE &amp; DEBT OPTIMIZATION</SectionEyebrow>

          <h1
            ref={headRef}
            className="mt-6 font-display text-[clamp(38px,4.8vw,68px)] font-light leading-[1.04] tracking-[-0.015em] text-ivory"
          >
            Managing <em className="gem-text italic">both sides</em> of your balance sheet.
          </h1>

          <p className="hero-rise mt-6 max-w-[50ch] font-sans text-[18px] leading-[1.7] text-parchment">
            True wealth management requires optimizing your liabilities alongside your assets. Real
            estate is often a client&rsquo;s largest holding and greatest tax exposure.
          </p>

          {/* Stat strip */}
          <div className="hero-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
            <CountStat value={2} prefix="$" suffix="B+" label="Funded mortgage capital" />
            <span aria-hidden className="hidden h-12 w-px bg-[rgba(214,185,140,0.35)] sm:block" />
            <CountStat value={11} suffix="+" label="Years specialized experience" />
            <span aria-hidden className="hidden h-12 w-px bg-[rgba(214,185,140,0.35)] sm:block" />
            <CountStat value={1} label="Integrated blueprint" />
          </div>

          <div className="hero-rise mt-10">
            <MagneticButton to="/contact" cursorLabel="Open">
              Discuss Your Structure
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Right visual — full-height bleed with facet-cut left edge */}
      <div
        ref={imgWrapRef}
        aria-hidden
        className="relative h-72 w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[41.666667%]"
        style={{ clipPath: FACET_CLIP }}
      >
        <img ref={imgRef} src="/gem-abstract.png" alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(14,12,11,0.55), transparent 45%)' }}
        />
      </div>
    </section>
  );
}

/** Section 2 — scroll-scrubbed lede word cascade + supporting body */
function IntegrationStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const lede = ledeRef.current;
    if (!root || !lede) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const split = splitWords(lede);

    const ctx = gsap.context(() => {
      // Word cascade tied to scroll progress
      gsap.fromTo(
        split.targets,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: lede, start: 'top 82%', end: 'top 32%', scrub: true },
        }
      );

      // Supporting body fades up
      gsap.fromTo(
        root.querySelector('.lede-body'),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.querySelector('.lede-body'), start: 'top 82%', once: true },
        }
      );
    }, root);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden py-24">
      <div className="container-rw">
        <div className="mx-auto max-w-[760px]">
          <p
            ref={ledeRef}
            className="font-display text-[clamp(20px,2.2vw,24px)] font-normal leading-[1.55] text-ivory"
          >
            With over 11 years of experience and $2 Billion+ in funded mortgage capital, we integrate
            debt structuring directly into your broader estate, corporate, and tax blueprint.
          </p>
          <p className="lede-body mt-8 font-sans text-[17px] leading-[1.7] text-parchment">
            Debt is not merely a cost to minimize — it is a strategic instrument. Structured
            correctly, it protects equity, funds tax liabilities at transfer, and releases capital
            for growth. Structured carelessly, it forces fire-sales, triggers tax events, and erodes
            generational wealth. Rubellite treats every mortgage and credit facility as a line item
            in your estate and tax blueprint — because that is exactly what it is.
          </p>
        </div>
      </div>
      <FacetEdge className="-bottom-8 right-[4%]" size={260} />
    </section>
  );
}

const STRATEGIES = [
  {
    numeral: '01',
    title: 'Corporate Real Estate Structuring',
    body: 'Align property ownership and debt across holding companies to safeguard assets and lower corporate tax exposure.',
    outcomes: [
      'Holding-company debt alignment',
      'Corporate refinancing strategy',
      'Asset safeguarding through structure',
    ],
    icon: '/pillar-realestate.svg',
  },
  {
    numeral: '02',
    title: 'Estate Liquidity & Capital Preservation',
    body: 'Plan debt structures to guarantee tax liabilities are funded upon transfer, avoiding the forced fire-sale of real estate assets.',
    outcomes: [
      'Tax-on-death funding certainty',
      'Heir protection from forced liquidation',
      'Capital gains coverage by design',
    ],
    icon: '/pillar-estate.svg',
  },
  {
    numeral: '03',
    title: 'Tax-Efficient Equity Extraction',
    body: 'Leverage property assets strategically to release liquidity for new ventures, succession planning, or investment opportunities without triggering unnecessary taxable events.',
    outcomes: [
      'Tax-free capital release',
      'Venture & succession funding',
      'Portfolio growth without tax leakage',
    ],
    icon: '/pillar-tax.svg',
  },
];

/** Section 3 — three strategies, umber band */
function Strategies() {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const head = headRef.current;
    const split = head ? splitWords(head) : null;

    const ctx = gsap.context(() => {
      if (split && head) {
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
    }, root);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="bg-umber py-28">
      <div className="container-rw">
        <div className="max-w-3xl">
          <SectionEyebrow>WHAT WE DO</SectionEyebrow>
          <h2
            ref={headRef}
            className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory"
          >
            Three strategies. <em className="gem-text italic">One liability blueprint.</em>
          </h2>
        </div>

        <div className="mt-24 space-y-24">
          {STRATEGIES.map((s) => (
            <StrategyRow
              key={s.numeral}
              numeral={s.numeral}
              title={s.title}
              body={s.body}
              outcomes={s.outcomes}
              icon={s.icon}
            />
          ))}
        </div>
        <div className="mt-14 border-t border-stone-line" aria-hidden />
      </div>
    </section>
  );
}

const WHY_CARDS = [
  {
    numeral: '01',
    title: 'Estate Liquidity & Tax Planning',
    body: 'Mortgages and debt structures determine how real estate assets are passed to heirs, how capital gains taxes are covered upon death, and whether estate assets must be liquidated under pressure.',
  },
  {
    numeral: '02',
    title: 'Corporate & Holding Co Structuring',
    body: 'High-net-worth clients and incorporated professionals frequently hold real estate inside corporate entities. Integrating mortgage expertise lets us optimize corporate debt, tax-free equity extraction, and property refinancing alongside your wealth plan.',
  },
  {
    numeral: '03',
    title: 'Real Estate Asset Protection',
    body: 'Debt is often used strategically to protect equity, manage cash flow, and optimize portfolio growth without triggering unnecessary tax events.',
  },
];

/** Section 4 — sticky header + scroll-spy numbered card stack */
function WhyDebtBelongs() {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const head = headRef.current;
    const split = !reduced && head ? splitWords(head) : null;

    const ctx = gsap.context(() => {
      if (split && head) {
        gsap.fromTo(
          split.targets,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.05,
            scrollTrigger: { trigger: head, start: 'top 80%', once: true },
          }
        );
      }

      if (!reduced) {
        // Cards stagger up on entry
        gsap.fromTo(
          root.querySelectorAll('.why-card'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.14,
            scrollTrigger: { trigger: root.querySelector('.why-stack'), start: 'top 78%', once: true },
          }
        );
      }
    }, root);

    // Scroll-spy: active card's edge + numeral light up
    const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.why-card'));
    const triggers = cards.map((card, i) =>
      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      })
    );

    return () => {
      ctx.revert();
      split?.revert();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={rootRef} className="py-28">
      <div className="container-rw grid gap-14 lg:grid-cols-12">
        {/* Sticky header */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-40">
            <SectionEyebrow>THE STRATEGIC LENS</SectionEyebrow>
            <h2
              ref={headRef}
              className="mt-6 font-display text-[clamp(30px,3.4vw,48px)] font-normal leading-[1.1] text-ivory"
            >
              Why debt belongs in your <em className="gem-text italic">estate &amp; wealth process</em>
            </h2>
            <p className="mt-5 font-sans text-[15px] leading-[1.7] text-taupe">
              Three reasons this pillar changes outcomes.
            </p>
          </div>
        </div>

        {/* Card stack */}
        <div className="why-stack space-y-8 lg:col-span-7">
          {WHY_CARDS.map((card, i) => (
            <article
              key={card.numeral}
              className={`why-card facet-notch facet-sheen border border-stone-line border-l-2 bg-basalt p-8 transition-[border-color] duration-500 md:p-10 ${
                active === i ? 'border-l-rubellite' : 'border-l-transparent'
              }`}
            >
              <div className="flex items-start gap-6">
                <span
                  aria-hidden
                  className={`gem-text font-display text-[clamp(40px,4vw,56px)] font-light leading-none transition-opacity duration-500 ${
                    active === i ? 'opacity-100' : 'opacity-35'
                  }`}
                  style={{ fontFeatureSettings: '"ss01"' }}
                >
                  {card.numeral}
                </span>
                <div>
                  <h3 className="font-display text-[clamp(20px,1.8vw,24px)] font-medium text-ivory">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[60ch] font-sans text-[15px] leading-[1.7] text-parchment">
                    {card.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Section 5 — advisor spotlight: Swarn Sidhu */
function AdvisorSpotlight() {
  const rootRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Portrait clip-reveal (inset 12% -> 0)
      gsap.fromTo(
        clipRef.current,
        { clipPath: 'inset(12% 12% 12% 12%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        }
      );

      // Portrait parallax at ~0.2x scroll speed
      gsap.fromTo(
        imgRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

      // Quote slides in from the right; ruby border draws vertically
      gsap.fromTo(
        root.querySelector('.quote-text'),
        { opacity: 0, x: 32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.querySelector('.quote-block'), start: 'top 78%', once: true },
        }
      );
      gsap.fromTo(
        root.querySelector('.quote-border'),
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.querySelector('.quote-block'), start: 'top 78%', once: true },
        }
      );

      // CTAs stagger up
      gsap.fromTo(
        root.querySelectorAll('.spotlight-cta'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root.querySelector('.spotlight-ctas'), start: 'top 88%', once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden py-28">
      <div className="container-rw grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Portrait */}
        <div className="lg:col-span-5">
          <div ref={clipRef} className="overflow-hidden" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
            <div className="facet-notch">
              <img
                ref={imgRef}
                src="/team-swarn.jpg"
                alt="Swarn Sidhu — Principal Mortgage Broker, Rubellite Wealth"
                className="aspect-[4/5] w-full scale-[1.14] object-cover grayscale-[35%] sepia-[12%] transition-[filter] duration-700 hover:grayscale-0 hover:sepia-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="lg:col-span-7">
          <SectionEyebrow>PILLAR LEADERSHIP</SectionEyebrow>
          <h3 className="mt-6 font-display text-[clamp(26px,2.6vw,32px)] font-medium leading-tight text-ivory">
            Swarn Sidhu — Principal Mortgage Broker
          </h3>

          <blockquote className="quote-block relative mt-9 pl-8">
            <span
              aria-hidden
              className="quote-border absolute left-0 top-0 h-full w-[3px] origin-top bg-rubellite"
            />
            <p className="quote-text font-display text-[clamp(18px,2vw,22px)] italic leading-[1.6] text-ivory">
              &ldquo;With over 11 years of experience and more than $2 Billion in funded mortgages,
              Swarn Sidhu brings an elite level of real estate asset structuring and debt
              optimization to Rubellite Wealth. We ensure your leverage, property holdings, and
              liability strategies directly align with your broader estate and tax goals.&rdquo;
            </p>
          </blockquote>

          <div className="spotlight-ctas mt-10 flex flex-wrap items-center gap-4">
            <span className="spotlight-cta inline-block">
              <Link to="/team?bio=swarn" className="btn-ghost" data-cursor="View">
                Read Swarn&rsquo;s Full Bio
              </Link>
            </span>
            <span className="spotlight-cta inline-block">
              <Link to="/contact" className="btn-primary" data-cursor="Open">
                Book a Consultation
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Section 6 — featured FAQ, auto-opens on scroll into view */
function FeaturedFaq() {
  return (
    <section className="py-24">
      <div className="container-rw">
        <div className="mx-auto max-w-[800px]">
          <SectionEyebrow center>COMMON QUESTION</SectionEyebrow>
          <div className="mt-10">
            <AccordionItem
              autoOpen
              question="Do you help with real estate and debt management as part of wealth planning?"
              answer="Yes. Real estate is often a client's largest asset—and liability. With over 11 years of experience and $2B+ in funded real estate capital, we integrate property debt structuring, liquidity management, and corporate real estate financing directly into your overarching wealth and estate plan."
            />
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="link-arrow">
              View all FAQs
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RealEstateDebtOptimization() {
  return (
    <>
      <PillarHero />
      <IntegrationStatement />
      <Strategies />
      <WhyDebtBelongs />
      <AdvisorSpotlight />
      <FeaturedFaq />
      <CTABand
        headline="Put your liabilities"
        accent="to work."
        primaryLabel="Book a Consultation"
        primaryTo="/contact"
        secondaryLabel="Back to All Services"
        secondaryTo="/services"
      />
    </>
  );
}
