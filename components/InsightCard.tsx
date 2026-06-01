import Link from 'next/link';
import type { Insight } from '@/types';

interface Props {
  insight: Insight;
}

const TYPE_COLORS: Record<string, string> = {
  News: 'bg-blue-100 text-blue-700',
  Thoughts: 'bg-purple-100 text-purple-700',
  Publications: 'bg-green-100 text-[#005B30]',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function InsightCard({ insight }: Props) {
  const colorClass = TYPE_COLORS[insight.insight_type] ?? 'bg-gray-100 text-gray-600';

  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex flex-col bg-white border border-gray-200 hover:border-[#005B30] hover:shadow-md transition-all duration-300"
    >
      {/* Image / placeholder */}
      <div className="h-48 bg-gradient-to-br from-[#0A1628] to-[#1A2F4E] overflow-hidden">
        {insight.featured_image?.url ? (
          <img
            src={insight.featured_image.url}
            alt={insight.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-bold tracking-wider uppercase px-2.5 py-1 ${colorClass}`}>
            {insight.insight_type}
          </span>
          {insight.publish_date && (
            <span className="text-xs text-gray-400">{formatDate(insight.publish_date)}</span>
          )}
        </div>

        <h3 className="text-base font-semibold text-[#0A1628] leading-snug mb-3 group-hover:text-[#005B30] transition-colors line-clamp-2">
          {insight.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{insight.excerpt}</p>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{insight.author}</span>
          <span className="text-xs font-semibold text-[#005B30] group-hover:gap-1.5 flex items-center gap-1 transition-all">
            Read more
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
