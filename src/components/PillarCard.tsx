import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface PillarCardProps {
  icon: string;
  title: string;
  description: string;
  to: string;
  /** Featured "New Core Pillar" treatment */
  featured?: boolean;
  className?: string;
}

/**
 * Basalt pillar card with facet-cut notch, champagne line icon,
 * hover lift + ruby border shift. Featured variant carries the ruby badge.
 */
export default function PillarCard({
  icon,
  title,
  description,
  to,
  featured = false,
  className = '',
}: PillarCardProps) {
  return (
    <article
      className={`group facet-notch facet-sheen relative rounded-2xl border bg-basalt p-8 transition-all duration-500 ease-out hover:-translate-y-1.5 md:p-10 ${
        featured
          ? 'border-rubellite/30 shadow-[0_0_0_rgba(201,24,74,0)] hover:border-rubellite/60'
          : 'border-stone-line hover:border-rubellite/50'
      } ${className}`}
    >
      {featured && (
        <span className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-rubellite/40 bg-ruby-deep/20 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ruby-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-rubellite" aria-hidden />
          New Core Pillar
        </span>
      )}
      <div className="pillar-icon mb-8 inline-block text-champagne">
        <img src={icon} alt="" width={64} height={64} className="h-14 w-14 md:h-16 md:w-16" loading="lazy" />
      </div>
      <h3 className="font-display text-[clamp(22px,2vw,30px)] font-medium leading-tight text-ivory">
        {title}
      </h3>
      <p className="mt-4 max-w-[52ch] font-sans text-[15px] leading-[1.7] text-parchment">{description}</p>
      <Link to={to} className="link-arrow mt-7" data-cursor="View">
        Explore
        <ArrowRight size={16} strokeWidth={1.5} />
      </Link>
    </article>
  );
}
