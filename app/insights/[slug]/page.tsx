import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getInsightBySlug, getInsightSlugs, getLatestInsights } from '@/lib/contentstack';
import InsightDetailLiveView from '@/components/InsightDetailLiveView';

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) return {};
  return {
    title: `${insight.title} | Citco`,
    description: insight.excerpt,
  };
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
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default async function InsightDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { live_preview?: string };
}) {
  const hash = searchParams.live_preview;

  const [insight, allInsights] = await Promise.all([
    getInsightBySlug(params.slug, hash),
    getLatestInsights(4),
  ]);

  if (!insight) notFound();

  const related = allInsights.filter(i => i.slug !== insight.slug).slice(0, 3);
  const typeColor = TYPE_COLORS[insight.insight_type] ?? 'bg-gray-100 text-gray-600';
  const uid: string | undefined = (insight as any).uid;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <span>/</span>
            <span className="text-white/70 truncate max-w-xs">{insight.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 ${typeColor}`}>
              {insight.insight_type}
            </span>
            {insight.publish_date && (
              <span className="text-white/40 text-sm">{formatDate(insight.publish_date)}</span>
            )}
          </div>
          <h1
            className="text-3xl lg:text-5xl font-bold text-white leading-tight max-w-3xl"
            data-cslp={uid ? `insight.${uid}.en-us.title` : undefined}
          >
            {insight.title}
          </h1>
          {insight.author && (
            <p className="text-white/50 mt-4 text-sm">By {insight.author}</p>
          )}
        </div>
      </section>

      <InsightDetailLiveView initialData={insight} related={related} />
    </>
  );
}
