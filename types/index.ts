export interface CSFile {
  url: string;
  title?: string;
  filename?: string;
}

export interface NavItem {
  label: string;
  url: string;
}

export interface Navigation {
  title: string;
  nav_items: NavItem[];
  utility_links: NavItem[];
}

export interface GeneralSettings {
  company_name: string;
  copyright_text: string;
  contact_email: string;
  linkedin_url: string;
  instagram_url: string;
}

// ─── Block data types (fields within each modular block) ──────────────────────
// The delivery SDK returns each section as { blockUid: blockData, _metadata?: {...} }

export interface HeroSectionData {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  hero_image?: CSFile;
  text_position?: 'left' | 'center' | 'right';
  text_alignment?: 'left' | 'center' | 'right';
}

export interface CsReference {
  uid: string;
  _content_type_uid: string;
}

export interface ServicesGridData {
  headline: string;
  tagline?: string;
  limit?: number;
  services?: CsReference[];
}

export interface ClientsGridData {
  headline: string;
  tagline?: string;
  clients?: CsReference[];
}

export interface StorySectionData {
  eyebrow?: string;
  headline: string;
  body?: string;
  cta_label?: string;
  cta_url?: string;
  since_year?: string;
  stats?: Array<{ value: string; label: string }>;
}

export interface InsightsTeaserData {
  headline: string;
  tagline?: string;
  cta_label?: string;
}

export interface InsightsGridData {
  headline: string;
  insights?: CsReference[];
}

export interface RichTextData {
  heading?: string;
  content: string;
}

export interface CtaBannerData {
  eyebrow?: string;
  headline: string;
  body?: string;
  cta_label?: string;
  cta_url?: string;
  background?: 'dark' | 'green' | 'light';
}

// Each section from delivery API: { blockUid: blockData, _metadata?: any }
export type PageSection = Record<string, any>;

// ─── Content type interfaces ──────────────────────────────────────────────────

export interface Homepage {
  title: string;
  url: string;
  sections: PageSection[];
}

export interface Page {
  title: string;
  url: string;
  slug: string;
  sections: PageSection[];
}

export interface ContactSidebar {
  heading?: string;
  body?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
}

export interface Service {
  uid: string;
  title: string;
  slug: string;
  tagline: string;
  short_description: string;
  full_description: string;
  featured_image?: CSFile;
  order: number;
  related_headline?: string;
  contact_sidebar?: ContactSidebar;
}

export interface ClientSegment {
  uid: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  featured_image?: CSFile;
}

export type InsightType = 'News' | 'Thoughts' | 'Publications';

export interface Insight {
  uid: string;
  title: string;
  slug: string;
  insight_type: InsightType;
  excerpt: string;
  content: string;
  featured_image?: CSFile;
  author: string;
  publish_date: string;
  more_insights_headline?: string;
}
