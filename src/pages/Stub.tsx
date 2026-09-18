import SectionEyebrow from '@/components/SectionEyebrow';

/** Temporary branded placeholder for sub-pages being built by page agents. */
export default function Stub({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="vault-gradient flex min-h-[60dvh] items-center">
      <div className="container-rw py-24">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(34px,4.5vw,64px)] font-normal leading-[1.08] text-ivory">
          {title}
        </h1>
      </div>
    </section>
  );
}
