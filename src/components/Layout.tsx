import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';
import Cursor from './Cursor';
import PageWipe from './PageWipe';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared site shell. The navbar is FIXED (80px, overlay style), so this
 * Layout owns the offset: the content slot gets `pt-20` so every page
 * starts below the nav. Full-bleed heroes opt out INSIDE the page
 * (e.g. a `-mt-20` on the hero section) — never by removing this offset.
 *
 * Also owns Lenis smooth scrolling (lerp 0.09) synced to GSAP ScrollTrigger,
 * the custom cursor, and the page-transition wipe.
 */
export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.0 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-obsidian text-ivory">
      <Cursor />
      <PageWipe />
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}
