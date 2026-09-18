import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { TeamMember } from '@/lib/team';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface TeamGridCardProps {
  member: TeamMember;
  /** True while this member's full-bio overlay is open — the overlay owns the shared layoutIds then */
  isOpen: boolean;
  onOpen: (id: TeamMember['id']) => void;
  /** Stagger index for the grid entrance */
  index: number;
}

/**
 * Team page leadership card (team.md §2). Shares the `bio-portrait-{id}` /
 * `bio-title-{id}` layoutId contract with the scaffold TeamCard so the
 * cinematic FLIP hand-off into FullBioOverlay behaves identically site-wide.
 */
export default function TeamGridCard({ member, isOpen, onOpen, index }: TeamGridCardProps) {
  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 1, delay: index * 0.16, ease: EASE }}
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="facet-notch facet-sheen overflow-hidden rounded-2xl border border-stone-line bg-basalt transition-colors duration-500 group-hover:border-[rgba(201,24,74,0.5)]"
      >
        {/* Portrait — shared FLIP element */}
        <motion.div
          layoutId={isOpen ? undefined : `bio-portrait-${member.id}`}
          className="relative overflow-hidden"
        >
          <motion.img
            src={member.portrait}
            alt={`Portrait of ${member.name}`}
            width={800}
            height={1000}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-all duration-500 [filter:grayscale(0.55)_contrast(1.05)] group-hover:[filter:grayscale(0)_contrast(1)]"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
          />
          {/* warm duotone veils that fade on hover */}
          <div className="pointer-events-none absolute inset-0 bg-ruby-deep/25 mix-blend-color transition-opacity duration-500 group-hover:opacity-0" />
          <div className="pointer-events-none absolute inset-0 bg-obsidian/20 transition-opacity duration-500 group-hover:opacity-0" />
        </motion.div>

        {/* Text block */}
        <div className="p-7">
          <div className="flex flex-wrap items-center gap-3">
            <motion.h3
              layoutId={isOpen ? undefined : `bio-title-${member.id}`}
              className="font-display text-[26px] font-medium leading-tight text-ivory"
            >
              {member.name}
            </motion.h3>
            {member.id === 'swarn' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rubellite/40 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ruby-glow">
                <span className="h-1.5 w-1.5 rounded-full bg-rubellite" />
                New Core Pillar Lead
              </span>
            )}
          </div>
          {/* champagne hairline draws beneath the name on hover */}
          <span className="hairline-champagne mt-3 block w-0 origin-left transition-all duration-500 group-hover:w-16" />
          <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-champagne">
            {member.role}
          </p>
          <p className="mt-4 font-sans text-[15px] leading-[1.7] text-parchment">{member.cardBio}</p>

          {/* Credential chips */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            {member.credentials.map((c) => (
              <span
                key={c}
                className="rounded-full border border-stone-line bg-basalt px-3.5 py-1.5 font-sans text-xs text-taupe"
              >
                {c}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpen(member.id)}
            aria-haspopup="dialog"
            data-cursor="Open"
            className="btn-ghost group/btn mt-7 !px-6 !py-3 text-[13px]"
          >
            Read Full Bio
            <ArrowRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </motion.div>
    </motion.article>
  );
}
