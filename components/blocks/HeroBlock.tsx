import Link from 'next/link';
import Image from 'next/image';
import type { HeroSectionData } from '@/types';

interface Props {
  block: HeroSectionData;
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

const positionClass: Record<string, string> = {
  left:   'justify-start',
  center: 'justify-center',
  right:  'justify-end',
};

const alignmentClass: Record<string, string> = {
  left:   'text-left',
  center: 'text-center',
  right:  'text-right',
};

export default function HeroBlock({ block, cslpPrefix }: Props) {
  const position  = block.text_position  ?? 'left';
  const alignment = block.text_alignment ?? 'left';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background: image when available, dark gradient fallback */}
      {block.hero_image?.url ? (
        <>
          <Image
            src={block.hero_image.url}
            alt={block.hero_image.title ?? block.headline}
            fill
            className="object-cover"
            priority
            {...cslp(cslpPrefix, 'hero_image')}
          />
          {/* Dark overlay so text stays readable over any image */}
          <div className="absolute inset-0 bg-[#0A1628]/70" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0D1F3C 50%, #0F2444 100%)' }}
        />
      )}

      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full border border-white/5 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full border border-white/5 -translate-y-1/2 translate-x-1/4" />

      {/* Text content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40 w-full flex ${positionClass[position]}`}>
        <div className={`max-w-3xl w-full ${alignmentClass[alignment]}`}>
          {block.eyebrow && (
            <p
              className="text-xs font-bold tracking-widest uppercase text-[#007A42] mb-6"
              {...cslp(cslpPrefix, 'eyebrow')}
            >
              {block.eyebrow}
            </p>
          )}
          <h1
            className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
            {...cslp(cslpPrefix, 'headline')}
          >
            {block.headline}
          </h1>
          {block.subheadline && (
            <p
              className="text-xl lg:text-2xl text-white/70 font-light leading-relaxed mb-10 max-w-2xl"
              {...cslp(cslpPrefix, 'subheadline')}
            >
              {block.subheadline}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            {block.primary_cta_label && block.primary_cta_url && (
              <Link
                href={block.primary_cta_url}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0A1628] font-semibold text-sm hover:bg-gray-100 transition-colors"
                {...cslp(cslpPrefix, 'primary_cta_label')}
              >
                {block.primary_cta_label}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
            {block.secondary_cta_label && block.secondary_cta_url && (
              <Link
                href={block.secondary_cta_url}
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                {...cslp(cslpPrefix, 'secondary_cta_label')}
              >
                {block.secondary_cta_label}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-12 bg-white/20" />
        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  );
}
