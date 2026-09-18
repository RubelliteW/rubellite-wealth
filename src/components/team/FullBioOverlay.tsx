import { memo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, animate } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import type { TeamMember } from '@/lib/team';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Slow ken-burns drift on the overlay portrait — isolated + memoized so the loop never resets */
const KenBurnsPortrait = memo(function KenBurnsPortrait({
  src,
  alt,
  drift,
}: {
  src: string;
  alt: string;
  drift: boolean;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      animate={drift ? { scale: [1, 1.08] } : undefined}
      transition={drift ? { duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' } : undefined}
    />
  );
});

/** Breathing ruby radial bloom behind the content column — isolated perpetual animation */
const AmbientBloom = memo(function AmbientBloom() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full"
      style={{ background: 'radial-gradient(280px 280px at center, rgba(201,24,74,0.16), transparent 70%)' }}
      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

/** Slow-rotating facet cluster (60s/rev) bottom-right of the overlay */
const SlowFacets = memo(function SlowFacets() {
  return (
    <motion.svg
      aria-hidden
      className="pointer-events-none absolute -bottom-20 -right-16 h-[320px] w-[320px] opacity-60"
      viewBox="0 0 200 200"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
    >
      <g stroke="rgba(214,185,140,0.14)" strokeWidth="0.8" strokeLinejoin="round">
        <polygon points="100,18 158,64 42,64" />
        <polygon points="42,64 100,18 100,120" />
        <polygon points="158,64 100,18 100,120" />
        <polygon points="42,64 100,120 20,150" />
        <polygon points="158,64 100,120 180,150" />
        <polygon points="100,120 180,150 100,186 20,150" />
      </g>
    </motion.svg>
  );
});

/** Fraunces numeral that counts up when the overlay opens (framer-motion animate, no render loop) */
function CountUp({
  value,
  prefix = '',
  suffix = '',
  delay = 0,
  reduced,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [value, prefix, suffix, delay, reduced]);

  return (
    <span ref={ref} className="gem-text font-display text-[clamp(40px,5vw,64px)] font-light leading-none">
      {prefix}0{suffix}
    </span>
  );
}

interface FullBioOverlayProps {
  member: TeamMember;
  onClose: () => void;
  /** Cross-profile FLIP: close this bio and open the counterpart's */
  onCrossNavigate: (id: TeamMember['id']) => void;
}

/**
 * The signature cinematic full-bio overlay (team.md §3).
 * Portrait + title share layoutIds with the grid card for the FLIP morph;
 * a ruby sweep crosses during the morph; bio text cascades in word-by-word;
 * chips spring-pop; stats count up. Reduced motion = simple crossfade.
 */
export default function FullBioOverlay({ member, onClose, onCrossNavigate }: FullBioOverlayProps) {
  const reduced = useReducedMotion() ?? false;
  const counterpartFirstName = member.counterpartId === 'swarn' ? 'Swarn' : 'Nick';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} — full bio`}
      className="fixed inset-0 z-[95] bg-obsidian"
      initial={{ opacity: reduced ? 0 : 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.25 : 0.3 }}
    >
      {/* 1 — Dim & blur the page behind */}
      <motion.div
        className="absolute inset-0 bg-[rgba(14,12,11,0.92)] backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* 2 — Ruby gradient sweep crossing left→right beneath the morph, 0.1s in */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, transparent 20%, rgba(201,24,74,0.28) 50%, transparent 80%)',
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        />
      )}

      <div className="relative flex h-full flex-col md:flex-row">
        {/* Left portrait column — shared FLIP element (40vw desktop / 40vh mobile banner) */}
        <motion.div
          layoutId={reduced ? undefined : `bio-portrait-${member.id}`}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative h-[40vh] w-full shrink-0 overflow-hidden md:h-full md:w-[40vw]"
        >
          <KenBurnsPortrait src={member.portrait} alt={`Portrait of ${member.name}`} drift={!reduced} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-obsidian/40" />
        </motion.div>

        {/* Right content column — data-lenis-prevent keeps native wheel scroll inside the overlay */}
        <div className="relative flex-1 overflow-y-auto" data-lenis-prevent>
          {!reduced && <AmbientBloom />}
          {!reduced && <SlowFacets />}

          <div className="relative mx-auto max-w-[640px] px-8 py-12 md:px-16 md:py-24">
            {/* 3 — Content cascade (starts 0.35s in) */}
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
            >
              {member.profileEyebrow}
            </motion.p>

            {/* Title — shared FLIP element */}
            <motion.h2
              layoutId={reduced ? undefined : `bio-title-${member.id}`}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-5 font-display text-[clamp(34px,4vw,56px)] font-normal leading-[1.08] text-ivory"
            >
              {member.name}
            </motion.h2>

            <motion.p
              className="mt-4 font-sans text-base font-medium text-ivory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              transition={{ delay: 0.42, duration: 0.5, ease: EASE }}
            >
              {member.role}
            </motion.p>
            <motion.p
              className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-champagne"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              transition={{ delay: 0.46, duration: 0.5, ease: EASE }}
            >
              {member.discipline}
            </motion.p>

            {/* Verbatim bio — word-level cascade, 0.008s per word */}
            <div className="mt-9 space-y-6">
              {member.fullBio.map((para, pi) => {
                const words = para.split(' ');
                return (
                  <motion.p
                    key={pi}
                    className="font-sans text-[17px] leading-[1.75] text-parchment"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.008, delayChildren: reduced ? 0 : 0.5 + pi * 0.3 },
                      },
                    }}
                  >
                    {words.map((word, wi) => (
                      <motion.span
                        key={wi}
                        className="inline-block"
                        variants={{
                          hidden: { opacity: 0, y: reduced ? 0 : 8 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: reduced ? 0.2 : 0.4, ease: EASE },
                          },
                        }}
                      >
                        {word}
                        {wi < words.length - 1 ? ' ' : ''}
                      </motion.span>
                    ))}
                  </motion.p>
                );
              })}
            </div>

            {/* Credential chips — spring pop, 0.1s stagger */}
            <div className="mt-9 flex flex-wrap gap-3">
              {member.credentials.map((c, i) => (
                <motion.span
                  key={c}
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
                  transition={{
                    delay: reduced ? 0 : 0.7 + i * 0.1,
                    type: 'spring',
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="rounded-full border border-champagne/40 px-4 py-1.5 font-sans text-xs font-medium tracking-wide text-champagne"
                >
                  {c}
                </motion.span>
              ))}
            </div>

            {/* Stat row — counts up on open */}
            <motion.div
              className="mt-12 grid grid-cols-2 gap-8 border-t border-stone-line pt-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              transition={{ delay: reduced ? 0 : 0.85, duration: 0.6, ease: EASE }}
            >
              {member.stats.map((s, i) => (
                <div key={s.label}>
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    delay={reduced ? 0 : 0.9 + i * 0.15}
                    reduced={reduced}
                  />
                  <div className="mt-3 font-sans text-[13px] leading-relaxed tracking-wide text-taupe">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs — book + cross-profile FLIP navigation */}
            <motion.div
              className="mt-12 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
              transition={{ delay: reduced ? 0 : 1, duration: 0.6, ease: EASE }}
            >
              <Link to={`/contact`} className="btn-primary" data-cursor="Open">
                Book a Consultation with {member.name.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={() => onCrossNavigate(member.counterpartId)}
                className="btn-ghost group/cross"
              >
                View {counterpartFirstName}&rsquo;s Profile
                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover/cross:translate-x-1"
                />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Close — rotates 90° on hover */}
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close bio"
        initial={{ opacity: 0, rotate: reduced ? 0 : -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0 }}
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute right-5 top-5 rounded-full border border-stone-line bg-obsidian/70 p-3 text-parchment backdrop-blur-sm transition-colors hover:border-rubellite hover:text-ivory md:right-8 md:top-8"
      >
        <X size={22} strokeWidth={1.5} />
      </motion.button>
    </motion.div>
  );
}
