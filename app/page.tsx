import { getHomepage, getServices, getClientSegments, getLatestInsights } from '@/lib/contentstack';
import HomepageLiveView from '@/components/HomepageLiveView';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { live_preview?: string };
}) {
  const hash = searchParams.live_preview;

  const [homepage, services, clients, insights] = await Promise.all([
    getHomepage(hash),
    getServices(),
    getClientSegments(),
    getLatestInsights(4),
  ]);

  if (!homepage) return null;

  return (
    <HomepageLiveView
      initialData={homepage}
      services={services}
      clients={clients}
      insights={insights}
    />
  );
}
