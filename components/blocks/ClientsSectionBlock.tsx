import ClientsSection from '@/components/ClientsSection';
import type { ClientsGridData, ClientSegment } from '@/types';

interface Props {
  block: ClientsGridData;
  clients: ClientSegment[];
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

export default function ClientsSectionBlock({ block, clients, cslpPrefix }: Props) {
  const refs = block.clients;
  const filtered =
    refs && refs.length > 0
      ? refs.map(r => clients.find(c => (c as any).uid === r.uid)).filter(Boolean) as ClientSegment[]
      : clients;

  return (
    <ClientsSection
      headline={block.headline}
      tagline={block.tagline ?? ''}
      clients={filtered}
      headlineCslp={cslp(cslpPrefix, 'headline')}
      taglineCslp={cslp(cslpPrefix, 'tagline')}
    />
  );
}
