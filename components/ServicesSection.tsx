import Link from 'next/link';
import ServiceCard from './ServiceCard';
import type { Service } from '@/types';

interface Props {
  headline: string;
  tagline: string;
  services: Service[];
  limit?: number;
  headlineCslp?: Record<string, string>;
  taglineCslp?: Record<string, string>;
}

export default function ServicesSection({ headline, tagline, services, limit, headlineCslp, taglineCslp }: Props) {
  const displayed = limit ? services.slice(0, limit) : services;

  return (
    <section className="bg-[#F5F6F7] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {(headline || tagline) && (
          <div className="max-w-2xl mb-14">
            {headline && <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-4" {...headlineCslp}>{headline}</h2>}
            {tagline && <p className="text-gray-500 text-lg leading-relaxed" {...taglineCslp}>{tagline}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200">
          {displayed.map(service => (
            <div key={service.uid ?? service.slug} className="bg-[#F5F6F7]">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {limit && services.length > limit && (
          <div className="mt-10 text-center">
            <Link
              href="/our-services"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#0A1628] text-[#0A1628] font-semibold text-sm hover:bg-[#0A1628] hover:text-white transition-all"
            >
              View All Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
