import * as contentstack from 'contentstack';
import type { Homepage, Navigation, GeneralSettings, Service, ClientSegment, Insight, Page } from '@/types';

const livePreviewConfig: Record<string, any> = {
  enable: Boolean(process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN),
  preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN || '',
  host: 'rest-preview.contentstack.com',
};

const stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  region: contentstack.Region.US,
  live_preview: livePreviewConfig,
} as any);

/** Build a data-cslp attribute object for Contentstack Visual Builder. */
export function cslp(
  contentType: string,
  entryUid: string | undefined,
  locale: string,
  fieldPath: string
): Record<string, string> {
  if (!entryUid) return {};
  return { 'data-cslp': `${contentType}.${entryUid}.${locale}.${fieldPath}` };
}

// result[0] is the entries array; result[0][0] is the first entry
async function findOne<T>(contentType: string): Promise<T | null> {
  const result = await stack.ContentType(contentType).Query().toJSON().find();
  return (result[0]?.[0] as T) ?? null;
}

async function findAll<T>(contentType: string, options?: { ascending?: string; limit?: number }): Promise<T[]> {
  let q: any = stack.ContentType(contentType).Query();
  if (options?.ascending) q = q.ascending(options.ascending);
  if (options?.limit) q = q.limit(options.limit);
  const result = await q.toJSON().find();
  return (result[0] as T[]) ?? [];
}

async function findBySlug<T>(contentType: string, slug: string): Promise<T | null> {
  const result = await stack.ContentType(contentType).Query().where('slug', slug).toJSON().find();
  return (result[0]?.[0] as T) ?? null;
}

export async function getHomepage(hash?: string) {
  if (hash) (stack as any).livePreviewQuery({ live_preview: hash });
  return findOne<Homepage>('homepage');
}

export async function getNavigation() {
  return findOne<Navigation>('navigation');
}

export async function getGeneralSettings() {
  return findOne<GeneralSettings>('general_settings');
}

export async function getServices() {
  return findAll<Service>('service', { ascending: 'order' });
}

export async function getServiceBySlug(slug: string, hash?: string) {
  if (hash) (stack as any).livePreviewQuery({ live_preview: hash });
  return findBySlug<Service>('service', slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map(s => s.slug).filter(Boolean);
}

export async function getClientSegments() {
  return findAll<ClientSegment>('client_segment');
}

export async function getInsights(limit?: number) {
  return findAll<Insight>('insight', limit ? { limit } : undefined);
}

export async function getLatestInsights(count = 4) {
  return getInsights(count);
}

export async function getInsightBySlug(slug: string, hash?: string) {
  if (hash) (stack as any).livePreviewQuery({ live_preview: hash });
  return findBySlug<Insight>('insight', slug);
}

export async function getInsightSlugs(): Promise<string[]> {
  const insights = await getInsights();
  return insights.map(i => i.slug).filter(Boolean);
}

// Slugs used by dedicated routes — excluded from [slug] static params
const DEDICATED_SLUGS = new Set(['our-clients']);

export async function getPageBySlug(slug: string, hash?: string) {
  if (hash) (stack as any).livePreviewQuery({ live_preview: hash });
  return findBySlug<Page>('page', slug);
}

export async function getPageSlugs(): Promise<string[]> {
  const pages = await findAll<Page>('page');
  return pages.map(p => p.slug).filter(s => s && !DEDICATED_SLUGS.has(s));
}
