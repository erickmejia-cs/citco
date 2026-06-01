'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ClientSegment } from '@/types';

interface Props {
  headline: string;
  tagline: string;
  clients: ClientSegment[];
  headlineCslp?: Record<string, string>;
  taglineCslp?: Record<string, string>;
}

export default function ClientsSection({ headline, tagline, clients, headlineCslp, taglineCslp }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#0A1628] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {(headline || tagline) && (
          <div className="max-w-2xl mb-14">
            {headline && <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" {...headlineCslp}>{headline}</h2>}
            {tagline && <p className="text-white/60 text-lg leading-relaxed" {...taglineCslp}>{tagline}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10">
          {clients.map((client, i) => (
            <button
              key={client.uid ?? client.slug}
              className={`group text-left p-8 transition-all duration-300 ${
                activeIndex === i ? 'bg-[#005B30]' : 'bg-[#0D1F3C] hover:bg-[#1A2F4E]'
              }`}
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            >
              <div className="mb-4">
                <div className={`w-8 h-0.5 mb-5 transition-all duration-300 ${
                  activeIndex === i ? 'bg-white' : 'bg-[#005B30] group-hover:bg-white/50'
                }`} />
                <h3 className="text-lg font-semibold text-white leading-tight">{client.title}</h3>
              </div>
              <p className={`text-sm leading-relaxed transition-all duration-300 ${
                activeIndex === i ? 'text-white/80 max-h-40 opacity-100' : 'text-white/50 max-h-0 opacity-0 overflow-hidden'
              }`}>
                {client.description}
              </p>
              {activeIndex !== i && (
                <p className="text-xs text-white/40 mt-3 font-medium">{client.tagline}</p>
              )}
              <div className={`mt-4 transition-all duration-300 ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`}>
                <Link
                  href="/our-clients"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white"
                  onClick={e => e.stopPropagation()}
                >
                  Learn more
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/our-clients"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold text-sm hover:bg-white hover:text-[#0A1628] transition-all"
          >
            View All Client Segments
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
