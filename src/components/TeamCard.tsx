import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import type { TeamMember } from '@/lib/team';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * TeamCard → FullBio cinematic FLIP transition (design.md §6.9).
 * Shared layoutIds morph the portrait + title between the grid card and
 * a full-screen bio overlay; a ruby gradient sweep crosses during morph;
 * bio text staggers in word-by-word; credentials pop with a spring.
 * Close via X, backdrop click, or Esc — the portrait flies back.
 */
export default function TeamCard({ member, large = false }: { member: TeamMember; large?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Grid card */}
      <motion.article
        className="group relative"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full text-left"
          aria-haspopup="dialog"
          data-cursor="Open"
        >
          <motion.div
            layoutId={open ? undefined : `bio-portrait-${member.id}`}
            className="facet-notch relative overflow-hidden rounded-2xl border border-stone-line"
          >
            <motion.img
              src={member.portrait}
              alt={`Portrait of ${member.name}`}
              width={800}
              height={1000}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-all duration-500 [filter:grayscale(0.55)_contrast(1.05)] group-hover:[filter:grayscale(0)_contrast(1)]"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            {/* duotone veil that fades on hover */}
            <div className="pointer-events-none absolute inset-0 bg-ruby-deep/25 mix-blend-color transition-opacity duration-500 group-hover:opacity-0" />
            <div className="pointer-events-none absolute inset-0 bg-obsidian/20 transition-opacity duration-500 group-hover:opacity-0" />
          </motion.div>

          <div className="pt-7">
            <motion.h3
              layoutId={open ? undefined : `bio-title-${member.id}`}
              className={`font-display font-medium text-ivory ${large ? 'text-3xl' : 'text-2xl'}`}
            >
              {member.name}
            </motion.h3>
            {/* champagne hairline draws under the name on hover */}
            <span className="hairline-champagne mt-3 block w-0 transition-all duration-500 group-hover:w-16" />
            <p className="mt-3 font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-champagne">
              {member.role}
            </p>
            <p className="mt-4 max-w-[52ch] font-sans text-[15px] leading-[1.7] text-parchment">
              {member.cardBio}
            </p>
            <span className="link-arrow mt-5">
              Read Full Bio
              <ArrowRight size={16} strokeWidth={1.5} />
            </span>
          </div>
        </button>
      </motion.article>

      {/* Full-bio overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="bio-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`${member.name} — full bio`}
            className="fixed inset-0 z-[95] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* dimmed blurred backdrop */}
            <motion.div
              className="absolute inset-0 bg-[rgba(14,12,11,0.9)] backdrop-blur-md"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* ruby gradient sweep during morph */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(115deg, transparent 20%, rgba(201,24,74,0.28) 50%, transparent 80%)' }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.6, ease: EASE }}
            />

            <motion.div className="relative grid max-h-full w-full max-w-5xl overflow-hidden rounded-2xl border border-stone-line bg-basalt md:grid-cols-[40%_60%]">
              {/* Portrait column — shared FLIP element */}
              <motion.div layoutId={`bio-portrait-${member.id}`} className="relative h-56 md:h-auto">
                <img
                  src={member.portrait}
                  alt={`Portrait of ${member.name}`}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-basalt/60 to-transparent md:bg-gradient-to-r" />
              </motion.div>

              {/* Bio column */}
              <div className="relative overflow-y-auto p-8 md:p-12">
                <motion.h3
                  layoutId={`bio-title-${member.id}`}
                  className="font-display text-3xl font-medium text-ivory md:text-4xl"
                >
                  {member.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
                  className="mt-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-champagne"
                >
                  {member.fullRole}
                </motion.p>

                {/* word-by-word bio reveal */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.012, delayChildren: 0.35 } } }}
                  className="mt-7 space-y-5"
                >
                  {member.fullBio.map((para, pi) => (
                    <p key={pi} className="font-sans text-[15px] leading-[1.75] text-parchment">
                      {para.split(' ').map((word, wi) => (
                        <motion.span
                          key={wi}
                          className="inline-block"
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                          }}
                        >
                          {word}
                          {wi < para.split(' ').length - 1 ? ' ' : ''}
                        </motion.span>
                      ))}
                    </p>
                  ))}
                </motion.div>

                {/* credential chips — spring pop */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {member.credentials.map((c, i) => (
                    <motion.span
                      key={c}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                      className="rounded-full border border-champagne/40 px-4 py-1.5 font-sans text-xs font-medium tracking-wide text-champagne"
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close bio"
                className="absolute right-4 top-4 rounded-full border border-stone-line bg-obsidian/60 p-2 text-parchment transition-colors hover:border-rubellite hover:text-ivory"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
