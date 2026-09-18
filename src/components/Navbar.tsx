import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Team', to: '/team' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

const SERVICE_LINKS = [
  { label: 'Tax Strategy', to: '/services#tax-strategy' },
  { label: 'Estate Planning', to: '/services#estate-planning' },
  { label: 'Risk Management', to: '/services#risk-management' },
  { label: 'Real Estate & Debt Optimization', to: '/services/real-estate-debt-optimization', isNew: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 40
  );
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change (render-time derived state pattern)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-20 transition-all duration-500 ${
          scrolled
            ? 'border-b border-stone-line bg-[rgba(14,12,11,0.72)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-rw flex h-full items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="Rubellite Wealth — Home">
            <img src="/logo-facet.svg" alt="" className="h-9 w-9" />
            <span className="font-sans text-[15px] font-semibold tracking-[0.28em] text-ivory">
              RUBELLITE
              <span className="ml-2 font-normal tracking-[0.28em] text-taupe">WEALTH</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              link.label === 'Services' ? (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `relative flex items-center gap-1 font-sans text-sm font-medium transition-colors duration-300 ${
                        isActive || pathname.startsWith('/services')
                          ? 'text-ivory'
                          : 'text-parchment hover:text-ivory'
                      }`
                    }
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                    />
                    {(pathname === link.to || pathname.startsWith('/services/')) && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-[26px] left-0 h-[3px] w-full bg-rubellite"
                      />
                    )}
                  </NavLink>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4"
                      >
                        <div className="rounded-xl border border-stone-line bg-basalt/95 p-2 shadow-2xl backdrop-blur-xl">
                          {SERVICE_LINKS.map((s) => (
                            <button
                              key={s.to}
                              type="button"
                              onClick={() => {
                                setServicesOpen(false);
                                const [path, hash] = s.to.split('#');
                                if (hash && pathname === path) {
                                  document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  navigate(s.to);
                                }
                              }}
                              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-sans text-sm text-parchment transition-colors hover:bg-umber hover:text-ivory"
                            >
                              {s.label}
                              {s.isNew && (
                                <span className="ml-3 inline-flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ruby-glow">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rubellite" />
                                  New pillar
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `relative font-sans text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-ivory' : 'text-parchment hover:text-ivory'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-[26px] left-0 h-[3px] w-full bg-rubellite"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className={`btn-primary hidden !px-6 !py-2.5 text-[13px] sm:inline-flex ${
                scrolled ? 'scale-95' : ''
              } transition-transform`}
              data-cursor="Open"
            >
              Book a Consultation
            </Link>
            <button
              type="button"
              className="text-ivory lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={26} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[80] flex flex-col bg-obsidian lg:hidden"
          >
            {/* rotating facet lines behind */}
            <motion.svg
              aria-hidden
              className="pointer-events-none absolute -right-24 top-1/3 h-[420px] w-[420px] opacity-40"
              viewBox="0 0 200 200"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
            >
              <g stroke="rgba(214,185,140,0.14)" strokeWidth="0.8" fill="none">
                <polygon points="100,18 158,64 42,64" />
                <polygon points="42,64 100,120 20,150" />
                <polygon points="158,64 100,120 180,150" />
                <polygon points="100,120 180,150 100,186 20,150" />
                <polygon points="42,64 100,18 100,120" />
                <polygon points="158,64 100,18 100,120" />
              </g>
            </motion.svg>

            <div className="container-rw flex h-20 items-center justify-between">
              <span className="font-sans text-[15px] font-semibold tracking-[0.28em] text-ivory">
                RUBELLITE
                <span className="ml-2 font-normal tracking-[0.28em] text-taupe">WEALTH</span>
              </span>
              <motion.button
                layoutId="menu-toggle"
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="text-ivory"
              >
                <X size={28} strokeWidth={1.5} />
              </motion.button>
            </div>

            <nav className="container-rw mt-8 flex flex-col gap-2" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 48 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={link.to}
                    className={`block border-b border-stone-line py-4 font-display text-4xl font-light ${
                      pathname === link.to ? 'gem-text' : 'text-ivory'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * NAV_LINKS.length + 0.1, duration: 0.55 }}
                className="pt-8"
              >
                <Link to="/contact" className="btn-primary" onClick={() => setMobileOpen(false)}>
                  Book a Consultation
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
