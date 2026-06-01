'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import InsightCard from './InsightCard';
import type { Insight } from '@/types';

interface Props {
  initialData: Insight;
  related: Insight[];
}

function cslp(uid: string | undefined, field: string): Record<string, string> {
  if (!uid) return {};
  return { 'data-cslp': `insight.${uid}.en-us.${field}` };
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

export default function InsightDetailLiveView({ initialData, related }: Props) {
  const [insight, setInsight] = useState<Insight>(initialData);

  useEffect(() => {
    async function setup() {
      const [{ default: ContentstackLivePreview }, { default: Contentstack }] =
        await Promise.all([
          import('@contentstack/live-preview-utils'),
          import('contentstack'),
        ]);

      ContentstackLivePreview.onEntryChange(async () => {
        try {
          const hash = ContentstackLivePreview.hash;
          const clientStack = (Contentstack as any).Stack({
            api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ?? '',
            delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ?? '',
            environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT ?? 'development',
            region: (Contentstack as any).Region?.US,
            live_preview: {
              enable: true,
              preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN ?? '',
              host: 'rest-preview.contentstack.com',
            },
          });

          if (hash && hash !== 'init') {
            clientStack.livePreviewQuery({ live_preview: hash });
          }

          const result = await clientStack.ContentType('insight').Query()
            .where('slug', insight.slug)
            .toJSON()
            .find();
          const entry = Array.isArray(result[0]) ? result[0][0] : result[0];
          if (entry) setInsight(entry);
        } catch (err) {
          console.warn('[InsightDetailLiveView] live refresh failed:', err);
        }
      });
    }
    setup();
  }, [insight.slug]);

  const uid: string | undefined = (insight as any).uid;
  const typeColor = TYPE_COLORS[insight.insight_type] ?? 'bg-gray-100 text-gray-600';

  return (
    <>
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <article className="lg:col-span-2">
              {insight.excerpt && (
                <p
                  className="text-xl text-gray-600 font-medium leading-relaxed border-l-4 border-[#005B30] pl-6 mb-10"
                  {...cslp(uid, 'excerpt')}
                >
                  {insight.excerpt}
                </p>
              )}
              <div className="space-y-5">
                {insight.content && insight.content.split('\n\n').map((para, i) => (
                  <p
                    key={i}
                    className="text-gray-600 text-lg leading-relaxed"
                    {...(i === 0 ? cslp(uid, 'content') : {})}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </article>

            <aside>
              <div className="bg-[#F5F6F7] p-8 sticky top-24">
                {insight.insight_type && (
                  <div className="mb-6">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold ${typeColor}`}
                      {...cslp(uid, 'insight_type')}
                    >
                      {insight.insight_type}
                    </span>
                  </div>
                )}
                {insight.author && (
                  <div className="mb-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Author</p>
                    <p className="text-sm font-medium text-gray-700" {...cslp(uid, 'author')}>
                      {insight.author}
                    </p>
                  </div>
                )}
                {insight.publish_date && (
                  <div className="mb-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Published</p>
                    <p className="text-sm font-medium text-gray-700" {...cslp(uid, 'publish_date')}>
                      {formatDate(insight.publish_date)}
                    </p>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <Link
                    href="/insights"
                    className="block w-full text-center px-6 py-3 border border-[#0A1628] text-[#0A1628] text-sm font-semibold hover:bg-[#0A1628] hover:text-white transition-colors"
                  >
                    Back to Insights
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && insight.more_insights_headline && (
        <section className="bg-[#F5F6F7] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-[#0A1628] mb-8"
              {...cslp(uid, 'more_insights_headline')}
            >
              {insight.more_insights_headline}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(i => (
                <InsightCard key={(i as any).uid ?? i.slug} insight={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
