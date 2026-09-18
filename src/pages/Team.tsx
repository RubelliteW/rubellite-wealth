import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { splitChars } from '@/lib/split';
import { TEAM } from '@/lib/team';
import type { TeamMember } from '@/lib/team';
import SectionEyebrow from '@/components/SectionEyebrow';
import FacetEdge from '@/components/FacetEdge';
import CTABand from '@/components/CTABand';
import TeamGridCard from '@/components/team/TeamGridCard';
import FullBioOverlay from '@/components/team/FullBioOverlay';
import PartnershipStatement from '@/components/team/PartnershipStatement';

type TeamId = TeamMember['id'];
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function isTeamId(v: string | null): v is TeamId {
  return v === 'nick' || v === 'swarn';
}

/**
 * Team (`/team`) — leadership grid + the signature cinematic full-bio
 * FLIP transition. Deep links: `/team?bio=nick` / `/team?bio=swarn`.
 */
export default function Team() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openId, setOpenId] = useState<TeamId | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const deepLinked = useRef(false);

  const openBio = (id: TeamId) => {
    setOpenId(id);
    setSearchParams({ bio: id });
  };
  const closeBio = () => {
    setOpenId(null);
    setSearchParams({});
  };
  /** Cross-profile FLIP: close current bio, open the counterpart 0.2s later */
  const crossNavigate = (id: TeamId) => {
    setOpenId(null);
    window.setTimeout(() => {
      setOpenId(id);
      setSearchParams({ bio: id });
    }, 200);
  };

  // Deep link: auto-open after the grid entrance completes (0.4s delay)
  useEffect(() => {
    if (deepLinked.current) return;
    deepLinked.current = true;
    const param = searchParams.get('bio');
    if (isTeamId(param)) {
      const t = window.setTimeout(() => setOpenId(param), 400);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc closes the overlay
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBio();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  // Scroll lock while the overlay is open (same mechanism as the shared TeamCard)
  useEffect(() => {
    document.body.style.overflow = openId ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openId]);

  // Hero H1 — char-split masked reveal (runs once the page wipe clears)
  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const split = splitChars(head);
    const tween = gsap.fromTo(
      split.targets,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.012, delay: 0.55 }
    );
    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  const openMember = TEAM.find((m) => m.id === openId) ?? null;

  return (
    <>
      {/* §1 — Page hero */}
      <section className="vault-gradient relative flex min-h-[50vh] items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          className="absolute -left-16 -top-10"
        >
          <FacetEdge size={240} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
          className="absolute -right-16 -top-10"
        >
          <FacetEdge size={240} />
        </motion.div>

        <div className="container-rw relative py-20 text-center">
          <SectionEyebrow center>Leadership</SectionEyebrow>
          <h1
            ref={headRef}
            className="mx-auto mt-6 max-w-4xl font-display text-[clamp(40px,5.4vw,72px)] font-light leading-[1.04] tracking-[-0.015em] text-ivory"
          >
            The architects behind <em className="gem-text italic">every blueprint.</em>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
            className="mx-auto mt-7 max-w-[54ch] font-sans text-[17px] leading-[1.7] text-parchment"
          >
            Two complementary disciplines — corporate tax &amp; estate strategy, and strategic debt
            &amp; investment coordination — unified in one advisory partnership.
          </motion.p>
        </div>
      </section>

      {/* §2 — Leadership grid */}
      <section className="py-28">
        <div className="container-rw">
          <div className="mx-auto grid max-w-[960px] gap-12 md:grid-cols-2">
            {TEAM.map((member, i) => (
              <TeamGridCard
                key={member.id}
                member={member}
                index={i}
                isOpen={openId === member.id}
                onOpen={openBio}
              />
            ))}
          </div>
        </div>
      </section>

      {/* §4 — Partnership statement */}
      <PartnershipStatement />

      {/* §5 — CTA band */}
      <CTABand
        headline="Bring both architects"
        accent="onto your plan."
        primaryLabel="Book a Consultation"
        primaryTo="/contact"
        secondaryLabel="Explore Our Services"
        secondaryTo="/services"
      />

      {/* §3 — Cinematic full-bio overlay (shared layoutId FLIP) */}
      <AnimatePresence>
        {openMember && (
          <FullBioOverlay
            key={openMember.id}
            member={openMember}
            onClose={closeBio}
            onCrossNavigate={crossNavigate}
          />
        )}
      </AnimatePresence>
    </>
  );
}
