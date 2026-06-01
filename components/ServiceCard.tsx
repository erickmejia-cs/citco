import Link from 'next/link';
import type { Service } from '@/types';

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <div className="group bg-white border border-gray-200 hover:border-[#005B30] transition-all duration-300 p-8 flex flex-col">
      {/* Icon placeholder */}
      <div className="w-12 h-12 bg-[#005B30]/10 flex items-center justify-center mb-5">
        <svg className="w-6 h-6 text-[#005B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-[#0A1628] mb-3 group-hover:text-[#005B30] transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
        {service.short_description}
      </p>
      <Link
        href={`/our-services/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#005B30] hover:gap-2.5 transition-all"
      >
        Read more
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
