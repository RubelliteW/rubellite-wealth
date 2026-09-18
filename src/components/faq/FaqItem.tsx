import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FaqItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

/**
 * FAQ accordion row (faq.md §3). Controlled so the parent group enforces
 * one-open-at-a-time. Open state: ruby 2px left border, +/− icon rotates 45°,
 * answer height-animates 0.45s with inner content sliding 12px.
 */
export default function FaqItem({ question, answer, open, onToggle }: FaqItemProps) {
  return (
    <div
      className={`border-b border-stone-line border-l-2 transition-[border-color] duration-500 ${
        open ? 'border-l-rubellite' : 'border-l-transparent'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 pl-5 pr-1 text-left"
      >
        <span className="font-display text-lg font-medium leading-snug text-ivory md:text-xl">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`shrink-0 ${open ? 'text-rubellite' : 'text-champagne'}`}
        >
          <Plus size={20} strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              exit={{ y: 12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="max-w-[62ch] pb-7 pl-5 pr-6 font-sans text-base leading-[1.65] text-parchment"
            >
              {answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
