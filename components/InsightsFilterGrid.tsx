'use client';

import { useState } from 'react';
import InsightCard from '@/components/InsightCard';
import type { Insight, InsightType } from '@/types';

const FILTERS: (InsightType | 'All')[] = ['All', 'News', 'Thoughts', 'Publications'];

interface Props {
  insights: Insight[];
}

export default function InsightsFilterGrid({ insights }: Props) {
  const [active, setActive] = useState<InsightType | 'All'>('All');

  const filtered = active === 'All' ? insights : insights.filter(i => i.insight_type === active);

  return (
    <section className="bg-[#F5F6F7] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-10 border-b border-gray-200 pb-4">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 text-sm font-semibold transition-all ${
                active === f
                  ? 'bg-[#0A1628] text-white'
                  : 'text-gray-500 hover:text-[#0A1628] hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-lg">No insights found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(insight => (
              <InsightCard key={insight.uid ?? insight.slug} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
