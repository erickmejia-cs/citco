import ServicesSection from '@/components/ServicesSection';
import type { ServicesGridData, Service } from '@/types';

interface Props {
  block: ServicesGridData;
  services: Service[];
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

export default function ServicesSectionBlock({ block, services, cslpPrefix }: Props) {
  const refs = block.services;
  const filtered =
    refs && refs.length > 0
      ? refs.map(r => services.find(s => (s as any).uid === r.uid)).filter(Boolean) as Service[]
      : services;

  return (
    <ServicesSection
      headline={block.headline}
      tagline={block.tagline ?? ''}
      services={filtered}
      limit={block.limit}
      headlineCslp={cslp(cslpPrefix, 'headline')}
      taglineCslp={cslp(cslpPrefix, 'tagline')}
    />
  );
}
