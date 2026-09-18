import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ChevronDown, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import SectionEyebrow from '@/components/SectionEyebrow';
import GemStat from '@/components/GemStat';
import FacetEdge from '@/components/FacetEdge';
import { splitWords } from '@/lib/split';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'expo.out';
const FM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const inputBase =
  'w-full rounded-xl border bg-obsidian px-4 font-sans text-[15px] text-ivory placeholder:text-taupe/70 transition-all duration-300 focus:border-rubellite focus:outline-none focus:shadow-[0_0_0_4px_rgba(201,24,74,0.15)]';
const inputOk = 'border-stone-line';
const inputErr = 'border-[rgba(201,24,74,0.6)]';
const labelCls = 'mb-2 block font-sans text-[13px] font-medium tracking-wide text-champagne';
const errorCls = 'mt-2 font-sans text-[13px] text-ruby-glow';

/* ------------------------------------------------------------------ */
/* Section 1 — Page Hero (40vh)                                        */
/* ------------------------------------------------------------------ */
function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const textureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const h1 = h1Ref.current;
    if (!root || !h1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const split = splitWords(h1);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
      // blueprint texture drifts x -30 -> 0 over 1.8s
      tl.fromTo(textureRef.current, { x: -30 }, { x: 0, duration: 1.8 }, 0)
        // H1 word-split masked reveal
        .fromTo(
          split.targets,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.06 },
          0.1
        )
        // sub fades up 20px, delay 0.3s
        .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3);
    }, root);
    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative -mt-20 flex min-h-[calc(40dvh+5rem)] items-center justify-center overflow-hidden pt-20"
    >
      {/* vault bloom top-right */}
      <div className="vault-gradient absolute inset-0" aria-hidden />
      {/* faint blueprint texture band along the bottom edge */}
      <div
        ref={textureRef}
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-44 opacity-35 [mask-image:linear-gradient(to_top,black_30%,transparent)]"
        style={{
          backgroundImage: "url('/blueprint-texture.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      <div className="container-rw relative z-10 py-16 text-center">
        <SectionEyebrow center>CONTACT</SectionEyebrow>
        <h1
          ref={h1Ref}
          className="mx-auto mt-8 max-w-[18ch] font-display text-[clamp(38px,5vw,64px)] font-light leading-[1.06] tracking-[-0.015em] text-ivory"
        >
          Every blueprint begins with <em className="gem-text italic">a conversation.</em>
        </h1>
        <p
          ref={subRef}
          className="mx-auto mt-7 max-w-[50ch] font-sans text-[17px] leading-[1.7] text-parchment"
        >
          Tell us about your structures, your properties, and your goals. We&rsquo;ll respond
          within one business day.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 (left) — Consultation form                                */
/* ------------------------------------------------------------------ */
const PILLAR_OPTIONS = [
  'Tax Strategy',
  'Estate Planning',
  'Risk Management',
  'Real Estate & Debt Optimization',
];
const PROFILE_OPTIONS = [
  'Business Owner',
  'Incorporated Professional',
  'High-Net-Worth Individual / Family',
  'Other',
];

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.email('Please enter a valid email address.'),
  phone: z.string().optional(),
  profile: z.string().min(1, 'Please select the option that fits best.'),
  message: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

/** Magnetic submit button (button-element counterpart of MagneticButton). */
function MagneticSubmit({ sending }: { sending: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || sending) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    if (Math.hypot(dx, dy) < rect.width / 2 + 24) {
      x.set(dx * 0.28);
      y.set(dy * 0.28);
    } else {
      x.set(0);
      y.set(0);
    }
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: FM_EASE }}
    >
      <button
        ref={ref}
        type="submit"
        disabled={sending}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
        data-cursor="Open"
      >
        {sending ? (
          <>
            <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
            Sending&hellip;
          </>
        ) : (
          'Request Consultation'
        )}
      </button>
    </motion.div>
  );
}

function ConsultationForm() {
  const [pillars, setPillars] = useState<string[]>(['Real Estate & Debt Optimization']);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur' });

  const togglePillar = (p: string) =>
    setPillars((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const onSubmit = async () => {
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 1400));
    setStatus('success');
  };

  return (
    <motion.div
      className="facet-sheen relative rounded-2xl border border-stone-line bg-basalt p-8"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: FM_EASE }}
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          /* Success panel — faceted gem pops with a spring + one rotation */
          <motion.div
            key="success"
            className="flex min-h-[480px] flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src="/logo-facet.svg"
              alt=""
              aria-hidden
              className="h-20 w-20"
              initial={{ scale: 0.3, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{ duration: 1.2, ease: FM_EASE }}
            />
            <h3 className="mt-8 font-display text-3xl font-medium text-ivory">Thank you.</h3>
            <p className="mt-4 max-w-[42ch] font-sans text-[15px] leading-[1.7] text-parchment">
              Your request has been received. A member of our advisory team will reach out within
              one business day.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full name */}
              <div>
                <label htmlFor="contact-name" className={labelCls}>
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  className={`${inputBase} h-12 ${errors.name ? inputErr : inputOk}`}
                  {...register('name')}
                />
                {errors.name && <p className={errorCls}>{errors.name.message}</p>}
              </div>
              {/* Email */}
              <div>
                <label htmlFor="contact-email" className={labelCls}>
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  className={`${inputBase} h-12 ${errors.email ? inputErr : inputOk}`}
                  {...register('email')}
                />
                {errors.email && <p className={errorCls}>{errors.email.message}</p>}
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="contact-phone" className={labelCls}>
                  Phone <span className="text-taupe">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  autoComplete="tel"
                  className={`${inputBase} h-12 ${inputOk}`}
                  {...register('phone')}
                />
              </div>
              {/* Profile select */}
              <div>
                <label htmlFor="contact-profile" className={labelCls}>
                  I am a&hellip;
                </label>
                <div className="relative">
                  <select
                    id="contact-profile"
                    defaultValue=""
                    className={`${inputBase} h-12 appearance-none pr-10 ${
                      errors.profile ? inputErr : inputOk
                    }`}
                    {...register('profile')}
                  >
                    <option value="" disabled className="text-taupe">
                      Select&hellip;
                    </option>
                    {PROFILE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-taupe"
                    aria-hidden
                  />
                </div>
                {errors.profile && <p className={errorCls}>{errors.profile.message}</p>}
              </div>
            </div>

            {/* Pillar chips */}
            <div className="mt-6">
              <span className={labelCls}>Which pillars are you most interested in?</span>
              <div className="flex flex-wrap gap-3">
                {PILLAR_OPTIONS.map((p) => {
                  const selected = pillars.includes(p);
                  return (
                    <motion.button
                      key={p}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => togglePillar(p)}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`rounded-full border px-4 py-2 font-sans text-[13px] font-medium transition-colors duration-300 ${
                        selected
                          ? 'border-rubellite bg-rubellite/10 text-ivory'
                          : 'border-stone-line text-taupe hover:border-taupe hover:text-parchment'
                      }`}
                    >
                      {p}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Situation textarea */}
            <div className="mt-6">
              <label htmlFor="contact-message" className={labelCls}>
                Tell us about your situation
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder="Properties, corporate structures, estate concerns, upcoming transitions…"
                className={`${inputBase} resize-y py-3 ${inputOk}`}
                {...register('message')}
              />
            </div>

            <div className="mt-8">
              <MagneticSubmit sending={status === 'sending'} />
              <p className="mt-4 text-center font-sans text-[12px] text-taupe">
                Confidential. No obligations. Response within one business day.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 (right) — Details column                                  */
/* ------------------------------------------------------------------ */
const EXPECTATIONS = [
  'A full balance-sheet review — assets and liabilities',
  'Identification of tax and estate inefficiencies',
  'A clear outline of your integrated blueprint',
];

function DetailsColumn() {
  const block = (i: number) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.8, delay: i * 0.12, ease: FM_EASE },
  });

  return (
    <div className="relative lg:sticky lg:top-[120px] lg:self-start">
      <div className="space-y-10">
        {/* Block 1 — Direct */}
        <motion.div {...block(0)}>
          <h3 className="eyebrow">DIRECT</h3>
          <ul className="mt-5 space-y-4">
            <li>
              <a
                href="mailto:info@rubellitewealth.ca"
                className="group inline-flex items-center gap-3 font-sans text-[15px] text-ivory"
              >
                <Mail size={16} strokeWidth={1.5} className="shrink-0 text-champagne" aria-hidden />
                <span className="relative">
                  info@rubellitewealth.ca
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-rubellite transition-transform duration-300 group-hover:scale-x-100"
                  />
                </span>
              </a>
            </li>
            <li>
              <a
                href="tel:+10000000000"
                className="group inline-flex items-center gap-3 font-sans text-[15px] text-ivory"
              >
                <Phone size={16} strokeWidth={1.5} className="shrink-0 text-champagne" aria-hidden />
                <span className="relative">
                  +1 (000) 000-0000
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-rubellite transition-transform duration-300 group-hover:scale-x-100"
                  />
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3 font-sans text-[15px] text-parchment">
              <MapPin size={16} strokeWidth={1.5} className="shrink-0 text-champagne" aria-hidden />
              Serving clients across Canada · In person &amp; virtual
            </li>
          </ul>
        </motion.div>

        {/* Block 2 — What to expect */}
        <motion.div {...block(1)}>
          <h3 className="eyebrow">WHAT TO EXPECT</h3>
          <ul className="mt-5 space-y-3">
            {EXPECTATIONS.map((item) => (
              <li key={item} className="flex gap-3 font-sans text-[15px] leading-[1.7] text-parchment">
                <span aria-hidden className="mt-0.5 text-champagne">
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Block 3 — Stat card */}
        <motion.div {...block(2)} className="rounded-2xl border border-stone-line bg-umber p-8">
          <div className="flex items-start gap-10">
            <GemStat
              value={2}
              prefix="$"
              suffix="B+"
              label="funded mortgage capital"
              numeralClassName="text-[clamp(36px,4vw,56px)]"
            />
            <GemStat
              value={11}
              suffix="+"
              label="years experience"
              numeralClassName="text-[clamp(36px,4vw,56px)]"
            />
          </div>
        </motion.div>
      </div>

      {/* Block 4 — decorative facet cluster */}
      <FacetEdge className="-bottom-16 right-0 hidden lg:block" size={200} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Form + Details (split)                                  */
/* ------------------------------------------------------------------ */
function FormSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container-rw grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ConsultationForm />
        </div>
        <div className="lg:col-span-5">
          <DetailsColumn />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Reassurance band                                        */
/* ------------------------------------------------------------------ */
const STATEMENT_WORDS = [
  'Confidential,',
  'structured,',
  'and',
  'measured',
  'against',
  'decades',
  '—',
  'not',
  'quarters.',
];
const REASSURANCE_CHIPS = [
  'Confidential by default',
  'No product pitches',
  'Both sides of the balance sheet',
];

function ReassuranceBand() {
  const rootRef = useRef<HTMLElement>(null);
  const stmtRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stmt = stmtRef.current;
    if (!root || !stmt) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // statement word-split scrub reveal
      gsap.fromTo(
        stmt.querySelectorAll('[data-stmt-word]'),
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: stmt, start: 'top 80%', end: 'bottom 50%', scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="vault-gradient bg-umber py-16 md:py-24">
      <div className="container-rw text-center">
        <p
          ref={stmtRef}
          className="mx-auto max-w-[760px] font-display text-[clamp(24px,2.6vw,34px)] font-normal leading-[1.4] text-ivory"
        >
          {STATEMENT_WORDS.map((word, i) =>
            word === 'decades' ? (
              <span key={i} data-stmt-word className="inline-block opacity-[0.15]">
                <em className="gem-text italic">{word}</em>
                {'\u00A0'}
              </span>
            ) : (
              <span key={i} data-stmt-word className="inline-block opacity-[0.15]">
                {word}
                {'\u00A0'}
              </span>
            )
          )}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {REASSURANCE_CHIPS.map((chip, i) => (
            <motion.span
              key={chip}
              className="rounded-full border border-stone-line px-4 py-1.5 font-sans text-xs font-medium tracking-wide text-parchment"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.1 }}
            >
              {chip}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — Mini FAQ cross-link                                     */
/* ------------------------------------------------------------------ */
function FaqCrossLink() {
  return (
    <section className="py-16">
      <motion.div
        className="container-rw text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.8, ease: FM_EASE }}
      >
        <p className="font-sans text-[15px] text-parchment">
          Wondering how real estate and debt fit into wealth planning?{' '}
          <Link to="/faq" className="link-arrow" data-cursor="View">
            Read our FAQ
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Contact() {
  return (
    <>
      <Hero />
      <FormSection />
      <ReassuranceBand />
      <FaqCrossLink />
    </>
  );
}
