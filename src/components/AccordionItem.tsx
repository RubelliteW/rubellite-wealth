import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AccordionItemProps {
  question: string;
  answer: string;
  /** Open once when scrolled into view (showcase behavior) */
  autoOpen?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export default function AccordionItem({
  question,
  answer,
  autoOpen = false,
  defaultOpen = false,
  className = '',
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);
  const autoOpened = useRef(false);

  useEffect(() => {
    if (!autoOpen || autoOpened.current) return;
    const el = ref.current;
    if (!el) return;
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
  }, [autoOpen]);

  return (
    <div
      ref={ref}
      className={`border-b border-stone-line border-l-2 bg-basalt/40 transition-[border-color] duration-500 ${
        open ? 'border-l-rubellite' : 'border-l-transparent'
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left"
      >
        <span className="font-display text-lg font-medium leading-snug text-ivory md:text-xl">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              exit={{ y: 12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[62ch] px-6 pb-7 font-sans text-base leading-[1.65] text-parchment"
            >
              {answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
