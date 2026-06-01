'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ServiceCard from './ServiceCard';
import type { Service } from '@/types';

interface Props {
  initialData: Service;
  related: Service[];
}

function cslp(uid: string | undefined, field: string): Record<string, string> {
  if (!uid) return {};
  return { 'data-cslp': `service.${uid}.en-us.${field}` };
}

export default function ServiceDetailLiveView({ initialData, related }: Props) {
  const [service, setService] = useState<Service>(initialData);

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

          const result = await clientStack.ContentType('service').Query()
            .where('slug', service.slug)
            .toJSON()
            .find();
          const entry = Array.isArray(result[0]) ? result[0][0] : result[0];
          if (entry) setService(entry);
        } catch (err) {
          console.warn('[ServiceDetailLiveView] live refresh failed:', err);
        }
      });
    }
    setup();
  }, [service.slug]);

  const uid: string | undefined = (service as any).uid;
  const sidebar = service.contact_sidebar;

  return (
    <>
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div className="space-y-5">
                {service.full_description
                  ? service.full_description.split('\n\n').map((para, i) => (
                      <p
                        key={i}
                        className="text-gray-600 leading-relaxed mb-5 text-lg"
                        {...(i === 0 ? cslp(uid, 'full_description') : {})}
                      >
                        {para}
                      </p>
                    ))
                  : service.short_description && (
                      <p className="text-gray-600 leading-relaxed text-lg" {...cslp(uid, 'short_description')}>
                        {service.short_description}
                      </p>
                    )
                }
              </div>
            </div>

            {sidebar && (
              <aside>
                <div className="bg-[#F5F6F7] p-8 sticky top-24">
                  {sidebar.heading && (
                    <h3
                      className="text-sm font-bold text-[#0A1628] uppercase tracking-wider mb-6"
                      {...cslp(uid, 'contact_sidebar.heading')}
                    >
                      {sidebar.heading}
                    </h3>
                  )}
                  {sidebar.body && (
                    <p className="text-gray-500 text-sm mb-6" {...cslp(uid, 'contact_sidebar.body')}>
                      {sidebar.body}
                    </p>
                  )}
                  {sidebar.primary_cta_label && sidebar.primary_cta_url && (
                    <Link
                      href={sidebar.primary_cta_url}
                      className="block w-full text-center px-6 py-3 bg-[#005B30] text-white text-sm font-semibold hover:bg-[#007A42] transition-colors"
                      {...cslp(uid, 'contact_sidebar.primary_cta_label')}
                    >
                      {sidebar.primary_cta_label}
                    </Link>
                  )}
                  {sidebar.secondary_cta_label && sidebar.secondary_cta_url && (
                    <Link
                      href={sidebar.secondary_cta_url}
                      className="block w-full text-center mt-3 px-6 py-3 border border-[#0A1628] text-[#0A1628] text-sm font-semibold hover:bg-[#0A1628] hover:text-white transition-colors"
                      {...cslp(uid, 'contact_sidebar.secondary_cta_label')}
                    >
                      {sidebar.secondary_cta_label}
                    </Link>
                  )}
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && service.related_headline && (
        <section className="bg-[#F5F6F7] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-[#0A1628] mb-8"
              {...cslp(uid, 'related_headline')}
            >
              {service.related_headline}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(s => (
                <ServiceCard key={(s as any).uid ?? s.slug} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
