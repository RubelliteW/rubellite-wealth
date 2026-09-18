import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PILLAR_LINKS = [
  { label: 'Tax Strategy', to: '/services#tax-strategy' },
  { label: 'Estate Planning', to: '/services#estate-planning' },
  { label: 'Risk Management', to: '/services#risk-management' },
  { label: 'Real Estate & Debt Optimization', to: '/services/real-estate-debt-optimization' },
];

const FIRM_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/team' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
  { label: 'Book a Consultation', to: '/contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[rgba(214,185,140,0.35)] bg-umber">
      <motion.div
        className="container-rw grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Col 1 — brand */}
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-facet.svg" alt="" className="h-9 w-9" />
            <span className="font-sans text-[15px] font-semibold tracking-[0.28em] text-ivory">
              RUBELLITE
              <span className="ml-2 font-normal tracking-[0.28em] text-taupe">WEALTH</span>
            </span>
          </Link>
          <p className="mt-6 max-w-[36ch] font-sans text-sm leading-[1.7] text-parchment">
            Holistic wealth blueprints for business owners, incorporated professionals, and
            high-net-worth families across Canada.
          </p>
          <img src="/faq-gem-line.svg" alt="" className="mt-8 h-6 w-48 opacity-70" aria-hidden />
        </motion.div>

        {/* Col 2 — pillars */}
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <h4 className="eyebrow">Pillars</h4>
          <ul className="mt-6 space-y-3">
            {PILLAR_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="font-sans text-sm text-parchment transition-colors hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Col 3 — firm */}
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <h4 className="eyebrow">Firm</h4>
          <ul className="mt-6 space-y-3">
            {FIRM_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="font-sans text-sm text-parchment transition-colors hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Col 4 — stat block */}
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="gem-text font-display text-4xl font-light leading-tight">11+ years</div>
          <div className="gem-text mt-2 font-display text-4xl font-light leading-tight">$2B+</div>
          <p className="mt-4 font-sans text-[13px] leading-relaxed text-taupe">
            funded mortgage capital · specialized real estate &amp; debt expertise
          </p>
        </motion.div>
      </motion.div>

      <div className="border-t border-stone-line">
        <div className="container-rw flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="font-sans text-xs text-taupe">
            © {year} Rubellite Wealth. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans text-xs text-taupe">
            <Link to="/contact" className="transition-colors hover:text-parchment">
              Privacy
            </Link>
            <Link to="/contact" className="transition-colors hover:text-parchment">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
