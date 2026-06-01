import Link from 'next/link';
import type { StorySectionData } from '@/types';

interface Props {
  block: StorySectionData;
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

export default function StoryBlock({ block, cslpPrefix }: Props) {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            {block.eyebrow && (
              <p
                className="text-xs font-bold tracking-widest uppercase text-[#005B30] mb-4"
                {...cslp(cslpPrefix, 'eyebrow')}
              >
                {block.eyebrow}
              </p>
            )}
            <h2
              className="text-3xl lg:text-4xl font-bold text-[#0A1628] leading-tight mb-6"
              {...cslp(cslpPrefix, 'headline')}
            >
              {block.headline}
            </h2>
            {block.body && (
              <p
                className="text-gray-500 text-lg leading-relaxed mb-8"
                {...cslp(cslpPrefix, 'body')}
              >
                {block.body}
              </p>
            )}
            {block.cta_label && block.cta_url && (
              <Link
                href={block.cta_url}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A1628] text-white font-semibold text-sm hover:bg-[#1A2F4E] transition-colors"
                {...cslp(cslpPrefix, 'cta_label')}
              >
                {block.cta_label}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="bg-[#0A1628] p-12 lg:p-16">
              {block.since_year && (
                <div className="text-[120px] font-bold text-white/5 leading-none select-none absolute top-8 right-8">
                  {block.since_year}
                </div>
              )}
              <div className="relative z-10">
                {block.since_year && (
                  <div
                    className="text-7xl font-bold text-white mb-3"
                    {...cslp(cslpPrefix, 'since_year')}
                  >
                    Since<br />{block.since_year}
                  </div>
                )}
                <div className="w-12 h-0.5 bg-[#005B30] mb-6" />
                {block.stats && block.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    {block.stats.map((stat, i) => (
                      <div key={i}>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/50 mt-1 uppercase tracking-wide">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
