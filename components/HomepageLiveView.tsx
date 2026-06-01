'use client';

import { useState, useEffect } from 'react';
import type { Homepage, Service, ClientSegment, Insight } from '@/types';
import BlockRenderer from './BlockRenderer';

interface Props {
  initialData: Homepage | null;
  services: Service[];
  clients: ClientSegment[];
  insights: Insight[];
}

export default function HomepageLiveView({ initialData, services, clients, insights }: Props) {
  const [homepage, setHomepage] = useState<Homepage | null>(initialData);

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

          const result = await clientStack.ContentType('homepage').Query().toJSON().find();
          const entry = Array.isArray(result[0]) ? result[0][0] : result[0];
          if (entry) setHomepage(entry);
        } catch (err) {
          console.warn('[HomepageLiveView] live refresh failed:', err);
        }
      });
    }
    setup();
  }, []);

  if (!homepage) return null;

  const uid: string | undefined = (homepage as any).uid;

  return (
    <BlockRenderer
      sections={homepage.sections ?? []}
      contentType="homepage"
      entryUid={uid}
      services={services}
      clients={clients}
      insights={insights}
    />
  );
}
