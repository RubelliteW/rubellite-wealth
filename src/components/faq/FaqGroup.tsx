import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FaqItem from './FaqItem';
import type { FaqEntry } from './data';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FaqGroupProps {
  label: string;
  /** Items after search filtering */
  items: FaqEntry[];
  /** True when the search query matches nothing in this group — dims to 25% */
  dimmed: boolean;
}

/**
 * FAQ §3 — a labelled accordion group. Enforces one-open-at-a-time within the
 * group; items enter staggered (28px, 0.07s) at 80% viewport and hide with a
 * 0.3s layout collapse when filtered out by search.
 */
export default function FaqGroup({ label, items, dimmed }: FaqGroupProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  // If the open item is filtered away, close it
  useEffect(() => {
    if (openQuestion && !items.some((i) => i.question === openQuestion)) {
      setOpenQuestion(null);
    }
  }, [items, openQuestion]);

  return (
    <motion.div
      animate={{ opacity: dimmed ? 0.25 : 1 }}
      transition={{ duration: 0.3 }}
      className={dimmed ? 'pointer-events-none' : ''}
    >
      {/* Group label — champagne eyebrow with 32px hairline draw */}
      <div className="flex items-center gap-4">
        <motion.span
          aria-hidden
          className="hairline-champagne w-8 shrink-0 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {label}
        </motion.span>
      </div>

      <motion.ul
        className="mt-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20% 0px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.question}
              layout
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.3, ease: EASE } }}
              className="overflow-hidden"
            >
              <FaqItem
                question={item.question}
                answer={item.answer}
                open={openQuestion === item.question}
                onToggle={() =>
                  setOpenQuestion((cur) => (cur === item.question ? null : item.question))
                }
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}
