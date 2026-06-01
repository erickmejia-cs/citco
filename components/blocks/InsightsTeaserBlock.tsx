import Link from 'next/link';
import type { InsightsTeaserData } from '@/types';

interface Props {
  block: InsightsTeaserData;
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

export default function InsightsTeaserBlock({ block, cslpPrefix }: Props) {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2
              className="text-2xl lg:text-3xl font-bold text-[#0A1628]"
              {...cslp(cslpPrefix, 'headline')}
            >
              {block.headline}
            </h2>
            {block.tagline && (
              <p className="text-gray-500 mt-2 max-w-xl" {...cslp(cslpPrefix, 'tagline')}>
                {block.tagline}
              </p>
            )}
          </div>
          {block.cta_label && (
            <Link
              href="/insights"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#005B30] text-white font-semibold text-sm hover:bg-[#007A42] transition-colors"
              {...cslp(cslpPrefix, 'cta_label')}
            >
              {block.cta_label}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
