import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import SectionEyebrow from '@/components/SectionEyebrow';
import CTABand from '@/components/CTABand';
import FacetEdge from '@/components/FacetEdge';
import { splitWords } from '@/lib/split';
import PillarNav, { scrollToPillar } from '@/components/services/PillarNav';
import type { PillarNavSection } from '@/components/services/PillarNav';
import PillarBlock from '@/components/services/PillarBlock';
import type { PillarBullet } from '@/components/services/PillarBlock';
import IntegrationDiagram from '@/components/services/IntegrationDiagram';

gsap.registerPlugin(ScrollTrigger);

const NAV_SECTIONS: PillarNavSection[] = [
  { id: 'tax-strategy', label: 'Tax Strategy' },
  { id: 'estate-planning', label: 'Estate Planning' },
  { id: 'risk-management', label: 'Risk Management' },
  { id: 'real-estate-debt-optimization', label: 'Real Estate & Debt Optimization', isNew: true },
];

interface PillarDef {
  id: string;
  numeral: string;
  eyebrow: string;
  title: React.ReactNode;
  paragraphs: string[];
  bullets: PillarBullet[];
  icon: string;
  flagship?: boolean;
}

const PILLARS: PillarDef[] = [
  {
    id: 'tax-strategy',
    numeral: '01',
    eyebrow: 'PILLAR 01',
    title: (
      <>
        Tax architecture that <em className="gem-text italic">keeps what you earn.</em>
      </>
    ),
    paragraphs: [
      'Proactive corporate and personal tax planning across every entity you own. We design structures that minimize erosion today and at transfer — so compounding works for your family, not against it.',
    ],
    bullets: [
      { text: 'Corporate restructuring & income optimization' },
      { text: 'Multi-entity tax coordination' },
      { text: 'Capital gains and succession tax planning' },
    ],
    icon: '/pillar-tax.svg',
  },
  {
    id: 'estate-planning',
    numeral: '02',
    eyebrow: 'PILLAR 02',
    title: (
      <>
        A legacy that transfers <em className="gem-text italic">without friction.</em>
      </>
    ),
    paragraphs: [
      'Multi-generational estate design that guarantees liquidity at the moment it is needed, protects heirs from forced sales, and keeps your intentions intact across decades.',
    ],
    bullets: [
      { text: 'Estate liquidity & tax-on-death planning' },
      { text: 'Trusts and multi-generational transfer design' },
      { text: 'Business succession architecture' },
    ],
    icon: '/pillar-estate.svg',
  },
  {
    id: 'risk-management',
    numeral: '03',
    eyebrow: 'PILLAR 03',
    title: (
      <>
        Protection calibrated <em className="gem-text italic">to the whole picture.</em>
      </>
    ),
    paragraphs: [
      'Insurance and risk structures sized to your actual exposure — corporate, personal, and property — integrated with the estate and tax plan rather than bolted on.',
    ],
    bullets: [
      { text: 'Corporate & personal insurance strategy' },
      { text: 'Key-person and buy-sell protection' },
      { text: 'Capital and income preservation structures' },
    ],
    icon: '/pillar-risk.svg',
  },
  {
    id: 'real-estate-debt-optimization',
    numeral: '04',
    eyebrow: 'PILLAR 04 · NEW CORE PILLAR',
    title: (
      <>
        Managing <em className="gem-text italic">both sides</em> of your balance sheet.
      </>
    ),
    paragraphs: [
      "True wealth management requires optimizing your liabilities alongside your assets. Real estate is often a client's largest holding and greatest tax exposure. With over 11 years of experience and $2 Billion+ in funded mortgage capital, we integrate debt structuring directly into your broader estate, corporate, and tax blueprint.",
    ],
    bullets: [
      {
        lead: 'Corporate Real Estate Structuring:',
        text: 'Align property ownership and debt across holding companies to safeguard assets and lower corporate tax exposure.',
      },
      {
        lead: 'Estate Liquidity & Capital Preservation:',
        text: 'Plan debt structures to guarantee tax liabilities are funded upon transfer, avoiding the forced fire-sale of real estate assets.',
      },
      {
        lead: 'Tax-Efficient Equity Extraction:',
        text: 'Leverage property assets strategically to release liquidity for new ventures, succession planning, or investment opportunities without triggering unnecessary taxable events.',
      },
    ],
    icon: '/pillar-realestate.svg',
    flagship: true,
  },
];

const WHY_ROWS = [
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

/** Section 1 — page hero with blueprint texture band + 4-segment pillar hairline */
function ServicesHero() {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const textureRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const head = headRef.current;
    const split = head ? splitWords(head) : null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Blueprint texture fades in with a slow horizontal drift
      tl.fromTo(
        textureRef.current,
        { opacity: 0, x: -40 },
        { opacity: 0.5, x: 0, duration: 2, ease: 'power2.out' },
        0
      );

      // H1 word-split masked reveal
      if (split) {
        tl.fromTo(
          split.targets,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 },
          0.2
        );
      }

      // Sub fades up
      tl.fromTo(
        root.querySelector('.hero-sub'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
        0.7
      );

      // 4-segment hairline draws beneath the H1, each lighting ruby sequentially
      const bases = root.querySelectorAll('.hero-seg-base');
      const rubies = root.querySelectorAll('.hero-seg-ruby');
      bases.forEach((seg, i) => {
        tl.to(seg, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 1.0 + i * 0.3);
        tl.to(rubies[i], { scaleX: 1, duration: 0.3, ease: 'expo.out' }, 1.3 + i * 0.3);
      });
    }, root);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative -mt-20 flex min-h-[60dvh] items-center overflow-hidden pt-20">
      <div aria-hidden className="absolute inset-0">
        <img
          ref={textureRef}
          src="/blueprint-texture.png"
          alt=""
          className="h-full w-full object-cover mix-blend-overlay"
          style={{ opacity: 0.5 }}
        />
        {/* Vault bloom, top-left this time */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(1200px 600px at 30% -10%, rgba(201,24,74,0.10), transparent 60%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-obsidian" />
      </div>

      <div className="container-rw relative py-24 text-center">
        <SectionEyebrow center>SERVICES · THE HOLISTIC FRAMEWORK</SectionEyebrow>
        <h1
          ref={headRef}
          className="mx-auto mt-6 max-w-4xl font-display text-[clamp(40px,5.5vw,76px)] font-light leading-[1.04] tracking-[-0.015em] text-ivory"
        >
          Four disciplines. <em className="gem-text italic">One seamless blueprint.</em>
        </h1>
        <p className="hero-sub mx-auto mt-6 max-w-[56ch] font-sans text-[17px] leading-[1.7] text-parchment">
          Tax strategy, estate planning, risk management, and real estate &amp; debt optimization —
          architected together so every structure, policy, and property works in concert.
        </p>

        {/* 4-segment pillar hairline */}
        <div className="mt-12 flex items-center justify-center gap-2" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="relative h-px w-14 md:w-20">
              <span className="hero-seg-base absolute inset-0 origin-left scale-x-0 bg-[rgba(214,185,140,0.35)]" />
              <span className="hero-seg-ruby absolute inset-0 origin-left scale-x-0 bg-rubellite" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Section 4 — scroll-lit "Why It Belongs" feature rows */
function WhyItBelongs() {
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

      gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.why-row')).forEach((row) => {
        const st = { trigger: row, start: 'top 60%', once: true };
        gsap.fromTo(
          row.querySelector('.why-hairline'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'expo.out', scrollTrigger: st }
        );
        gsap.fromTo(
          row.querySelector('.why-numeral'),
          { opacity: 0.35 },
          { opacity: 1, duration: 1.1, ease: 'power2.out', scrollTrigger: st }
        );
        gsap.fromTo(
          row.querySelector('.why-title'),
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: st }
        );
        gsap.fromTo(
          row.querySelector('.why-body'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.15, scrollTrigger: st }
        );
      });
    }, root);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative py-28">
      <div className="container-rw">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow center>THE STRATEGIC CASE</SectionEyebrow>
          <h2
            ref={headRef}
            className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory"
          >
            Why it belongs in your <em className="gem-text italic">estate &amp; wealth process</em>
          </h2>
        </div>

        <div className="mt-16">
          {WHY_ROWS.map((row) => (
            <div key={row.numeral} className="why-row">
              <div className="why-hairline hairline-champagne origin-left" style={{ transform: 'scaleX(0)' }} />
              <div className="grid gap-6 py-16 md:grid-cols-12 md:items-start">
                <div
                  aria-hidden
                  className="why-numeral gem-text font-display text-[clamp(64px,7vw,96px)] font-light leading-none md:col-span-3"
                  style={{ opacity: 0.35, fontFeatureSettings: '"ss01"' }}
                >
                  {row.numeral}
                </div>
                <div className="md:col-span-9">
                  <h3 className="why-title font-display text-[clamp(22px,2vw,26px)] font-medium text-ivory">
                    {row.title}
                  </h3>
                  <p className="why-body mt-4 max-w-[60ch] font-sans text-[16px] leading-[1.7] text-parchment">
                    {row.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Section 5 — cross-pillar integration diagram header + visual */
function IntegrationSection() {
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
    <section ref={rootRef} className="relative overflow-hidden bg-umber/40 py-28">
      <FacetEdge className="-left-16 top-10" size={240} />
      <div className="container-rw relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow center>CROSS-PILLAR INTEGRATION</SectionEyebrow>
          <h2
            ref={headRef}
            className="mt-6 font-display text-[clamp(34px,4vw,60px)] font-normal leading-[1.08] text-ivory"
          >
            Every facet of the plan, <em className="gem-text italic">cut to work as one.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-[56ch] font-sans text-[16px] leading-[1.7] text-parchment">
            No pillar operates in isolation. Debt, tax, estate, and risk decisions are cut from the
            same stone — each angle shaping the brilliance of the whole.
          </p>
        </div>
        <div className="mt-20">
          <IntegrationDiagram />
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  const { hash } = useLocation();

  // Deep links like /services#estate-planning (from the navbar dropdown)
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const timer = window.setTimeout(() => scrollToPillar(id), 500);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <>
      <ServicesHero />
      <PillarNav sections={NAV_SECTIONS} />

      {PILLARS.map((pillar, i) => (
        <div key={pillar.id}>
          {i > 0 && !pillar.flagship && (
            <div className="container-rw" aria-hidden>
              <img src="/faq-gem-line.svg" alt="" className="mx-auto w-full max-w-[720px] opacity-70" loading="lazy" />
            </div>
          )}
          <PillarBlock
            id={pillar.id}
            numeral={pillar.numeral}
            eyebrow={pillar.eyebrow}
            title={pillar.title}
            paragraphs={pillar.paragraphs}
            bullets={pillar.bullets}
            icon={pillar.icon}
            mirrored={i % 2 === 1}
            flagship={pillar.flagship}
          >
            {pillar.flagship && (
              <div className="pillar-body mt-10 flex flex-wrap items-center gap-5">
                <Link to="/services/real-estate-debt-optimization" className="btn-primary" data-cursor="Open">
                  Explore This Pillar in Depth
                </Link>
                <Link to="/faq" className="link-arrow">
                  Read the FAQ
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </div>
            )}
          </PillarBlock>
        </div>
      ))}

      <WhyItBelongs />
      <IntegrationSection />
      <CTABand
        headline="Start with a blueprint,"
        accent="not a product."
        primaryLabel="Book a Consultation"
        primaryTo="/contact"
        secondaryLabel="Meet the Team"
        secondaryTo="/team"
      />
    </>
  );
}
