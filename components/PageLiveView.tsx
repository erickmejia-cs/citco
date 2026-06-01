'use client';

import { useState, useEffect } from 'react';
import type { Page, Service, ClientSegment, Insight } from '@/types';
import BlockRenderer from './BlockRenderer';

interface Props {
  initialData: Page;
  services: Service[];
  clients: ClientSegment[];
  insights: Insight[];
}

export default function PageLiveView({ initialData, services, clients, insights }: Props) {
  const [page, setPage] = useState<Page>(initialData);

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

          const result = await clientStack.ContentType('page').Query()
            .where('slug', page.slug)
            .toJSON()
            .find();
          const entry = Array.isArray(result[0]) ? result[0][0] : result[0];
          if (entry) setPage(entry);
        } catch (err) {
          console.warn('[PageLiveView] live refresh failed:', err);
        }
      });
    }
    setup();
  }, [page.slug]);

  const uid: string | undefined = (page as any).uid;

  return (
    <BlockRenderer
      sections={page.sections ?? []}
      contentType="page"
      entryUid={uid}
      services={services}
      clients={clients}
      insights={insights}
    />
  );
}
