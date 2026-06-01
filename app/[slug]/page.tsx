import { notFound } from 'next/navigation';
import { getPageBySlug, getPageSlugs, getServices, getClientSegments, getLatestInsights } from '@/lib/contentstack';
import PageLiveView from '@/components/PageLiveView';

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return {};
  return { title: `${page.title} | Citco` };
}

export default async function GenericPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { live_preview?: string };
}) {
  const hash = searchParams.live_preview;

  const [page, services, clients, insights] = await Promise.all([
    getPageBySlug(params.slug, hash),
    getServices(),
    getClientSegments(),
    getLatestInsights(4),
  ]);

  if (!page) notFound();

  return (
    <PageLiveView
      initialData={page}
      services={services}
      clients={clients}
      insights={insights}
    />
  );
}
