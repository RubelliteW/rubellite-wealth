import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FeaturedQuestionProps {
  question: string;
  answer: string;
}

/**
 * FAQ §2 — Featured verbatim real-estate/debt question. Elevated umber card
 * with a 3px ruby left border that draws vertically first, a spring-popping
 * "Most Asked" badge, and a one-time auto-open when scrolled into view.
 */
export default function FeaturedQuestion({ question, answer }: FeaturedQuestionProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const autoOpened = useRef(false);

  // Auto-open once when the card scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el || autoOpened.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !autoOpened.current) {
          autoOpened.current = true;
          setOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, ease: EASE }}
      className="facet-notch relative overflow-hidden rounded-2xl border border-stone-line bg-umber"
    >
      {/* Ruby left border draws vertically first */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 top-0 w-[3px] origin-top bg-rubellite"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-6 px-7 py-7 text-left md:px-9"
      >
        <span>
          {/* Most Asked badge — spring pop, 0.4s delay */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-rubellite/50 bg-rubellite/10 px-3.5 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ruby-glow"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rubellite" />
            Most Asked
          </motion.span>
          <span className="block font-display text-xl font-medium leading-snug text-ivory md:text-2xl">
            {question}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`mt-1 shrink-0 ${open ? 'text-rubellite' : 'text-champagne'}`}
        >
          <Plus size={22} strokeWidth={1.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              exit={{ y: 12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="px-7 pb-8 md:px-9"
            >
              <p className="max-w-[62ch] font-sans text-[17px] leading-[1.75] text-parchment">
                {answer}
              </p>
              <Link to="/services/real-estate-debt-optimization" className="link-arrow mt-6">
                Explore the Real Estate &amp; Debt Optimization pillar
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
