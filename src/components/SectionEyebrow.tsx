import { motion } from 'framer-motion';

interface SectionEyebrowProps {
  children: string;
  className?: string;
  /** Center the eyebrow (hairline still sits left of the text) */
  center?: boolean;
}

/**
 * Champagne uppercase label with a 32px champagne hairline to its left.
 * Letters animate in with a 0.02s char stagger on scroll into view.
 */
export default function SectionEyebrow({ children, className = '', center = false }: SectionEyebrowProps) {
  const chars = Array.from(children);
  return (
    <motion.div
      className={`flex items-center gap-4 ${center ? 'justify-center' : ''} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
    >
      <motion.span
        className="hairline-champagne w-8 shrink-0 origin-left"
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
      <span className="eyebrow" aria-label={children}>
        {chars.map((c, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
          >
            {c === ' ' ? ' ' : c}
          </motion.span>
        ))}
      </span>
    </motion.div>
  );
}
