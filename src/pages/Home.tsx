import { Suspense, lazy, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import SectionEyebrow from '@/components/SectionEyebrow';
import PillarCard from '@/components/PillarCard';
import GemStat from '@/components/GemStat';
import FacetEdge from '@/components/FacetEdge';
import CTABand from '@/components/CTABand';
import AccordionItem from '@/components/AccordionItem';
import TeamCard from '@/components/TeamCard';
import MagneticButton from '@/components/MagneticButton';
import { splitChars, splitWords } from '@/lib/split';
import { TEAM } from '@/lib/team';

gsap.registerPlugin(ScrollTrigger);

const GemParticleField = lazy(() => import('@/components/GemParticleField'));

const EASE = 'expo.out';

/* ------------------------------------------------------------------ */
/* Section 1 — Hero                                                    */
/* ------------------------------------------------------------------ */
function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const h1 = h1Ref.current;
    if (!root || !h1) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ken-burns on the texture layer (slow scale yoyo)
    let kenBurns: gsap.core.Tween | undefined;
    if (imgRef.current && !reduced) {
      kenBurns = gsap.to(imgRef.current, {
        scale: 1.06,
        duration: 30,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
    // Scroll indicator dot loop
    let dotLoop: gsap.core.Tween | undefined;
    if (dotRef.current && !reduced) {
      dotLoop = gsap.fromTo(
        dotRef.current,
        { y: 0, opacity: 1 },
        { y: 24, opacity: 0, duration: 1.6, ease: 'power1.in', repeat: -1 }
      );
    }
    if (reduced) {
      return () => {
        kenBurns?.kill();
        dotLoop?.kill();
      };
    }

    const split = splitChars(h1);
    const ctx = gsap.context(() => {
      // Load timeline
      const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.25 });
      tl.fromTo(
        split.targets,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.015 }
      )
        .fromTo(subRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo(
          ctaRef.current?.children ?? [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          '-=0.35'
        );

      // Scroll: content parallaxes up 0.4x and fades over first 60vh
      gsap.to(contentRef.current, {
        yPercent: -40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '60% top', scrub: true },
      });
      // Particle cloud drifts downward 0.15x
      gsap.to(particleRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);

    return () => {
      kenBurns?.kill();
      dotLoop?.kill();
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative -mt-20 flex min-h-[100dvh] items-center overflow-hidden">
      {/* Layer 1: rubellite macro photo */}
      <img
        ref={imgRef}
        src="/hero-facets.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      {/* Layer 2: vault gradient bloom */}
      <div className="vault-gradient absolute inset-0" aria-hidden />
      {/* Layer 3: particle gem cloud, right-of-center */}
      <div ref={particleRef} className="absolute inset-y-0 right-0 hidden w-[55%] md:block">
        <Suspense
          fallback={
            <div
              className="h-full w-full"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(255,77,125,0.4), transparent 70%)',
                filter: 'blur(80px)',
                opacity: 0.25,
              }}
            />
          }
        >
          <GemParticleField className="h-full w-full" />
        </Suspense>
      </div>
      {/* Mobile-only particle fallback blob */}
      <div
        className="absolute -right-24 top-24 h-96 w-96 rounded-full md:hidden"
        aria-hidden
        style={{
          background: 'radial-gradient(closest-side, rgba(255,77,125,0.4), transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.25,
        }}
      />

      {/* Layer 4: content */}
      <div ref={contentRef} className="container-rw relative z-10 grid grid-cols-12 pt-20">
        <div className="col-span-12 md:col-span-7">
          <SectionEyebrow>PRIVATE WEALTH ADVISORY · CANADA</SectionEyebrow>
          <h1
            ref={h1Ref}
            className="mt-8 font-display text-[clamp(44px,6.2vw,92px)] font-light leading-[1.04] tracking-[-0.015em] text-ivory"
          >
            Wealth, architected across{' '}
            <em className="gem-text italic">both sides of your balance sheet.</em>
          </h1>
          <p
            ref={subRef}
            className="mt-8 max-w-[46ch] font-sans text-[17px] leading-[1.7] text-parchment"
          >
            Rubellite Wealth designs holistic blueprints for business owners, incorporated
            professionals, and high-net-worth families — unifying tax strategy, estate planning,
            risk management, and real estate &amp; debt optimization.
          </p>
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton to="/contact" cursorLabel="Open">
              Book a Consultation
            </MagneticButton>
            <MagneticButton to="/services" variant="ghost">
              Explore the Four Pillars
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom-left: scroll indicator */}
      <div className="absolute bottom-8 left-6 z-10 flex flex-col items-center gap-3 md:left-10">
        <span
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-taupe [writing-mode:vertical-rl]"
        >
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-champagne/30">
          <span ref={dotRef} className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rubellite" />
        </span>
      </div>

      {/* Bottom-right: mini stats */}
      <div className="absolute bottom-8 right-6 z-10 hidden gap-12 text-right sm:flex md:right-10">
        <GemStat
          value={2}
          prefix="$"
          suffix="B+"
          duration={1.8}
          numeralClassName="text-[clamp(32px,3.4vw,52px)]"
          label="funded mortgage capital"
        />
        <GemStat
          value={11}
          suffix="+"
          duration={1.8}
          numeralClassName="text-[clamp(32px,3.4vw,52px)]"
          label="years of specialized experience"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Intro statement                                         */
/* ------------------------------------------------------------------ */
function IntroStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const el = statementRef.current;
    if (!root || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = splitWords(el);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.targets,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.05,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        }
      );
      // ruby light-sweep rule beneath the italic phrase
      gsap.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: EASE,
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
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
      <FacetEdge className="-left-10 -top-10" size={260} />
      <div className="container-rw">
        <div className="mx-auto max-w-[720px] text-center">
          <SectionEyebrow center>THE RUBELLITE APPROACH</SectionEyebrow>
          <h2
            ref={statementRef}
            className="mt-8 font-display text-[clamp(28px,3.4vw,40px)] font-normal leading-[1.2] text-ivory"
          >
            Most advisors manage your assets. We architect your entire financial structure —{' '}
            <span className="relative inline-block">
              <em className="gem-text italic">liabilities included.</em>
              <span
                ref={ruleRef}
                aria-hidden
                className="absolute -bottom-2 left-0 block h-px w-full origin-left bg-gradient-to-r from-ruby-deep via-rubellite to-ruby-glow"
              />
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-[62ch] font-sans text-[17px] leading-[1.7] text-parchment">
            Rubellite Wealth was founded on a distinct premise: effective financial planning must
            address both sides of the balance sheet. Your properties, your corporate debt, your
            leverage strategy — each is a facet of the same stone.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — The Four Pillars                                        */
/* ------------------------------------------------------------------ */
const PILLARS = [
  {
    icon: '/pillar-tax.svg',
    title: 'Tax Strategy',
    description:
      'Proactive corporate and personal tax architecture that minimizes erosion across every entity you own.',
    to: '/services#tax-strategy',
  },
  {
    icon: '/pillar-estate.svg',
    title: 'Estate Planning',
    description:
      'Multi-generational transfer design that protects wealth and guarantees liquidity when it matters most.',
    to: '/services#estate-planning',
  },
  {
    icon: '/pillar-risk.svg',
    title: 'Risk Management',
    description:
      'Insurance and protection structures calibrated to safeguard capital, income, and legacy.',
    to: '/services#risk-management',
  },
];

function Pillars() {
  const rootRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const h2 = h2Ref.current;
    if (!root || !h2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = splitWords(h2);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.targets,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.06,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        }
      );
      const cards = gridRef.current?.querySelectorAll('[data-pillar-card]') ?? [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASE,
          stagger: 0.12,
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
          onComplete: () => {
            // featured card: ruby border-glow pulse once, then 6s breathe loop
            const feat = featuredRef.current?.firstElementChild as HTMLElement | null;
            if (!feat) return;
            gsap.fromTo(
              feat,
              { boxShadow: '0 0 0 rgba(201,24,74,0)' },
              {
                boxShadow: '0 0 32px rgba(201,24,74,0.25)',
                duration: 1.4,
                ease: 'sine.inOut',
                onComplete: () => {
                  gsap.to(feat, {
                    boxShadow: '0 0 14px rgba(201,24,74,0.12)',
                    duration: 3,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                  });
                },
              }
            );
          },
        }
      );
    }, root);
    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative py-16 md:py-28" id="pillars">
      <div className="container-rw">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>A HOLISTIC FRAMEWORK</SectionEyebrow>
            <h2
              ref={h2Ref}
              className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory"
            >
              Four pillars. <em className="gem-text italic">One blueprint.</em>
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="font-sans text-[15px] leading-[1.7] text-parchment">
              Every Rubellite plan integrates all four disciplines, so no decision is made in
              isolation.
            </p>
            <Link to="/services" className="link-arrow mt-4">
              All services
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <div ref={gridRef} className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured new pillar */}
          <div ref={featuredRef} className="lg:col-span-5 lg:-translate-y-4" data-pillar-card>
            <PillarCard
              featured
              icon="/pillar-realestate.svg"
              title="Real Estate & Debt Optimization"
              description="Managing both sides of your balance sheet. Strategic property debt structuring, equity extraction, and corporate real estate financing — aligned with your estate and tax plan. Backed by 11+ years and $2B+ in funded mortgage capital."
              to="/services/real-estate-debt-optimization"
              className="h-full"
            />
          </div>
          {/* Established pillars */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {PILLARS.map((p) => (
              <div key={p.title} data-pillar-card>
                <PillarCard {...p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — Why It Belongs in Your Estate & Wealth Process          */
/* ------------------------------------------------------------------ */
const WHY_ROWS = [
  {
    num: '01',
    title: 'Estate Liquidity & Tax Planning',
    body: 'Mortgages and debt structures determine how real estate assets are passed to heirs, how capital gains taxes are covered upon death, and whether estate assets must be liquidated under pressure.',
  },
  {
    num: '02',
    title: 'Corporate & Holding Co Structuring',
    body: 'High-net-worth clients and incorporated professionals frequently hold real estate inside corporate entities. Integrating mortgage expertise lets us optimize corporate debt, tax-free equity extraction, and property refinancing alongside your wealth plan.',
  },
  {
    num: '03',
    title: 'Real Estate Asset Protection',
    body: 'Debt is often used strategically to protect equity, manage cash flow, and optimize portfolio growth without triggering unnecessary tax events.',
  },
];

function WhyItBelongs() {
  const rootRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // each row activates as it crosses 60% viewport
      root.querySelectorAll<HTMLElement>('[data-why-row]').forEach((row) => {
        const numeral = row.querySelector('[data-why-numeral]');
        const numeralGlow = row.querySelector('[data-why-numeral-glow]');
        const title = row.querySelector('[data-why-title]');
        const body = row.querySelector('[data-why-body]');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 60%', once: true },
          defaults: { ease: EASE },
        });
        tl.fromTo(title, { x: -24, opacity: 0.2 }, { x: 0, opacity: 1, duration: 0.7 })
          .fromTo(body, { opacity: 0 }, { opacity: 1, duration: 0.7 }, '<0.1')
          .to(numeral, { opacity: 0.6, duration: 0.6 }, '<')
          .fromTo(numeralGlow, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '<');
      });

      // sticky image parallax 0.25x + ruby inner-glow growing with progress
      if (imgWrapRef.current) {
        gsap.to(imgWrapRef.current.querySelector('img'), {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.fromTo(
          imgWrapRef.current,
          { boxShadow: '0 0 0 rgba(201,24,74,0)' },
          {
            boxShadow: 'inset 0 0 60px rgba(201,24,74,0.22), 0 0 40px rgba(201,24,74,0.12)',
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top 60%', end: 'bottom 40%', scrub: true },
          }
        );
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-umber py-16 md:py-28">
      <div className="container-rw grid grid-cols-1 gap-14 lg:grid-cols-12">
        {/* Sticky left column */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[120px]">
            <SectionEyebrow>THE STRATEGIC LENS</SectionEyebrow>
            <h2 className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory">
              Why debt belongs in your{' '}
              <em className="gem-text italic">estate &amp; wealth process</em>
            </h2>
            <p className="mt-6 max-w-[52ch] font-sans text-[17px] leading-[1.7] text-parchment">
              Mortgages and debt structures are not transactions — they are planning instruments.
              Here is why we integrate them into every blueprint.
            </p>
            <div
              ref={imgWrapRef}
              className="facet-notch mt-10 overflow-hidden rounded-2xl border border-stone-line transition-shadow"
            >
              <img
                src="/gem-abstract.png"
                alt="Abstract refracted ruby light through faceted glass"
                width={1200}
                height={1200}
                loading="lazy"
                className="aspect-square w-full scale-110 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right numbered rows */}
        <div className="lg:col-span-7">
          {WHY_ROWS.map((row) => (
            <div
              key={row.num}
              data-why-row
              className="border-t border-[rgba(214,185,140,0.35)] py-10 first:border-t-0 first:pt-0 lg:py-12"
            >
              <div className="relative font-display text-5xl font-light text-ivory/25 md:text-6xl">
                <span data-why-numeral>{row.num}</span>
                <span
                  data-why-numeral-glow
                  aria-hidden
                  className="gem-text absolute inset-0 opacity-0"
                >
                  {row.num}
                </span>
              </div>
              <h3
                data-why-title
                className="mt-5 font-display text-[clamp(22px,2vw,30px)] font-medium text-ivory"
              >
                {row.title}
              </h3>
              <p data-why-body className="mt-4 max-w-[58ch] font-sans text-[15px] leading-[1.75] text-parchment">
                {row.body}
              </p>
            </div>
          ))}
          <div className="border-t border-[rgba(214,185,140,0.35)] pt-8">
            <Link to="/services/real-estate-debt-optimization" className="link-arrow" data-cursor="View">
              Explore Real Estate &amp; Debt Optimization
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — $2B stat band (pinned)                                  */
/* ------------------------------------------------------------------ */
const QUOTE =
  'With over 11 years of experience and more than $2 Billion in funded mortgages, Swarn Sidhu brings an elite level of real estate asset structuring and debt optimization to Rubellite Wealth. We ensure your leverage, property holdings, and liability strategies directly align with your broader estate and tax goals.';

function StatBand() {
  const rootRef = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      num.textContent = '$2B+';
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const words = root.querySelectorAll('[data-quote-word]');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });
      tl.to(counter, {
        v: 2,
        duration: 1,
        ease: 'none',
        onUpdate: () => {
          const p = tl.progress();
          const prefix = p >= 0.4 ? '$' : '';
          const suffix = p >= 0.7 ? 'B+' : '';
          num.textContent = `${prefix}${Math.round(counter.v)}${suffix}`;
        },
      })
        .fromTo(
          root.querySelectorAll('[data-stat-line]'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: 'none', stagger: 0 },
          0
        )
        .to(words, { opacity: 1, duration: 0.6, stagger: 0.02, ease: 'none' }, 0.35);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="vault-gradient relative flex min-h-[100dvh] items-center overflow-hidden bg-obsidian">
      <div className="container-rw text-center">
        <div className="flex items-center justify-center gap-8">
          <span data-stat-line className="hairline-champagne hidden w-24 origin-right md:block md:w-40" />
          <span
            className="gem-text font-display text-[clamp(96px,14vw,180px)] font-light leading-none"
            style={{ fontFeatureSettings: '"ss01"' }}
          >
            <span ref={numRef}>0</span>
          </span>
          <span data-stat-line className="hairline-champagne hidden w-24 origin-left md:block md:w-40" />
        </div>
        <p className="mt-6 font-sans text-sm uppercase tracking-[0.2em] text-taupe">
          funded mortgage capital · 11+ years of specialized real estate &amp; debt expertise
        </p>
        <blockquote className="mx-auto mt-14 max-w-[68ch] font-display text-[clamp(20px,2.2vw,28px)] italic leading-[1.5] text-ivory">
          {QUOTE.split(' ').map((word, i) => (
            <span key={i} data-quote-word className="inline-block opacity-15">
              {word}
              {'\u00A0'}
            </span>
          ))}
        </blockquote>
        <p className="mt-8 font-sans text-[13px] text-taupe">
          — Swarn Sidhu, Principal Mortgage Broker
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 6 — Team preview                                            */
/* ------------------------------------------------------------------ */
function TeamPreview() {
  return (
    <section className="py-16 md:py-28">
      <div className="container-rw">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>LEADERSHIP</SectionEyebrow>
            <h2 className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory">
              The architects behind <em className="gem-text italic">the blueprint</em>
            </h2>
          </div>
          <Link to="/team" className="link-arrow shrink-0" data-cursor="View">
            Meet the team
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
/* Section 7 — FAQ teaser                                              */
/* ------------------------------------------------------------------ */
const FAQ_ITEMS = [
  {
    question: 'Do you help with real estate and debt management as part of wealth planning?',
    answer:
      "Yes. Real estate is often a client's largest asset—and liability. With over 11 years of experience and $2B+ in funded real estate capital, we integrate property debt structuring, liquidity management, and corporate real estate financing directly into your overarching wealth and estate plan.",
  },
  {
    question: 'Who does Rubellite Wealth work with?',
    answer:
      'Business owners, incorporated professionals, and high-net-worth families who want a coordinated, proactive wealth blueprint rather than disconnected financial products.',
  },
  {
    question: 'What makes Rubellite different from a traditional advisory firm?',
    answer:
      'We plan across four pillars at once — tax, estate, risk, and real estate debt — so every structure works together seamlessly toward your long-term goals.',
  },
];

function FaqTeaser() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-faq-item]'),
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="py-16 md:py-28">
      <div className="container-rw grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionEyebrow>QUESTIONS</SectionEyebrow>
          <h2 className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory">
            Answers, before <em className="gem-text italic">you ask.</em>
          </h2>
          <p className="mt-6 max-w-[46ch] font-sans text-[17px] leading-[1.7] text-parchment">
            Clarity is part of the blueprint. A few of the questions we hear most often.
          </p>
          <Link to="/faq" className="link-arrow mt-6" data-cursor="View">
            View all FAQs
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="lg:col-span-7">
          <div className="border-t border-stone-line">
            {FAQ_ITEMS.map((item, i) => (
              <div key={item.question} data-faq-item>
                <AccordionItem question={item.question} answer={item.answer} autoOpen={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      <Hero />
      <IntroStatement />
      <Pillars />
      <WhyItBelongs />
      <StatBand />
      <TeamPreview />
      <FaqTeaser />
      <CTABand />
    </>
  );
}
