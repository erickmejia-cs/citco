import Link from 'next/link';
import type { CtaBannerData } from '@/types';

interface Props {
  block: CtaBannerData;
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

const BG: Record<string, string> = {
  dark: 'bg-[#0A1628]',
  green: 'bg-[#005B30]',
  light: 'bg-[#F5F6F7]',
};

const THEME: Record<string, { heading: string; body: string; btn: string; hover: string }> = {
  dark: { heading: 'text-white', body: 'text-white/60', btn: 'bg-white text-[#0A1628]', hover: 'hover:bg-gray-100' },
  green: { heading: 'text-white', body: 'text-white/80', btn: 'bg-white text-[#005B30]', hover: 'hover:bg-gray-100' },
  light: { heading: 'text-[#0A1628]', body: 'text-gray-500', btn: 'bg-[#0A1628] text-white', hover: 'hover:bg-[#1A2F4E]' },
};

export default function CtaBannerBlock({ block, cslpPrefix }: Props) {
  const bg = block.background ?? 'dark';
  const bgClass = BG[bg] ?? BG.dark;
  const theme = THEME[bg] ?? THEME.dark;

  return (
    <section className={`${bgClass} py-20`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {block.eyebrow && (
          <p
            className="text-xs font-bold tracking-widest uppercase text-[#007A42] mb-4"
            {...cslp(cslpPrefix, 'eyebrow')}
          >
            {block.eyebrow}
          </p>
        )}
        <h2
          className={`text-3xl font-bold ${theme.heading} mb-4`}
          {...cslp(cslpPrefix, 'headline')}
        >
          {block.headline}
        </h2>
        {block.body && (
          <p className={`${theme.body} text-lg mb-8`} {...cslp(cslpPrefix, 'body')}>
            {block.body}
          </p>
        )}
        {block.cta_label && block.cta_url && (
          <Link
            href={block.cta_url}
            className={`inline-flex items-center gap-2 px-8 py-4 ${theme.btn} font-semibold text-sm ${theme.hover} transition-colors`}
            {...cslp(cslpPrefix, 'cta_label')}
          >
            {block.cta_label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
