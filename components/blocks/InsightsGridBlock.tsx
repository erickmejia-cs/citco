import InsightsFilterGrid from '@/components/InsightsFilterGrid';
import type { InsightsGridData, Insight } from '@/types';

interface Props {
  block: InsightsGridData;
  insights: Insight[];
  cslpPrefix?: string;
}

export default function InsightsGridBlock({ block, insights }: Props) {
  const refs = block.insights;
  const filtered =
    refs && refs.length > 0
      ? refs.map(r => insights.find(i => (i as any).uid === r.uid)).filter(Boolean) as Insight[]
      : insights;

  return <InsightsFilterGrid insights={filtered} />;
}
