#!/usr/bin/env node
// Run with: node scripts/setup-contentstack.js

const BASE_URL = 'https://api.contentstack.io/v3';
const API_KEY = 'bltf8a5fd00d92ce3b4';
const MGMT_TOKEN = 'cs2f5c5fadcd4425f229b7fa05';
const ENVIRONMENT = 'development';

const HEADERS = {
  'api_key': API_KEY,
  'authorization': MGMT_TOKEN,
  'Content-Type': 'application/json',
};

async function cma(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    console.error(`  ✗ ${method} ${path} → ${res.status}:`, JSON.stringify(json).slice(0, 300));
    throw new Error(`${res.status}: ${JSON.stringify(json).slice(0, 100)}`);
  }
  return json;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Field helpers ────────────────────────────────────────────────────────────

function tf(uid, label, opts = {}) {
  return {
    data_type: 'text',
    display_name: label,
    uid,
    field_metadata: { description: '', default_value: '' },
    format: '',
    error_messages: { format: '' },
    multiple: false,
    mandatory: opts.mandatory ?? false,
    unique: opts.unique ?? false,
    non_localizable: false,
  };
}

function ff(uid, label) {
  return {
    data_type: 'file',
    display_name: label,
    uid,
    extensions: [],
    field_metadata: { description: '', rich_text_type: 'standard' },
    multiple: false,
    mandatory: false,
    unique: false,
    non_localizable: false,
  };
}

function df(uid, label) {
  return {
    data_type: 'isodate',
    display_name: label,
    uid,
    startDate: null,
    endDate: null,
    field_metadata: { description: '' },
    multiple: false,
    mandatory: false,
    unique: false,
    non_localizable: false,
  };
}

function nf(uid, label) {
  return {
    data_type: 'number',
    display_name: label,
    uid,
    field_metadata: { description: '' },
    multiple: false,
    mandatory: false,
    unique: false,
    non_localizable: false,
  };
}

function dropdown(uid, label, choices, mandatory = false) {
  return {
    data_type: 'text',
    display_name: label,
    uid,
    display_type: 'dropdown',
    enum: { advanced: false, choices: choices.map(v => ({ value: v })) },
    field_metadata: { description: '' },
    multiple: false,
    mandatory,
    unique: false,
    non_localizable: false,
  };
}

function urlField() {
  return {
    data_type: 'text',
    display_name: 'URL',
    uid: 'url',
    field_metadata: { _default: true, description: '', default_value: '' },
    format: '',
    error_messages: { format: '' },
    multiple: false,
    mandatory: true,
    unique: true,
    non_localizable: false,
  };
}

function group(uid, label, schema, multiple = false) {
  return {
    data_type: 'group',
    display_name: label,
    uid,
    field_metadata: { description: '' },
    schema,
    multiple,
    mandatory: false,
    unique: false,
    non_localizable: false,
  };
}

function globalFieldRef(uid, label, refUid) {
  return {
    data_type: 'global_field',
    display_name: label,
    uid,
    reference_to: refUid,
    field_metadata: { description: '' },
    mandatory: false,
    multiple: false,
    unique: false,
    non_localizable: false,
  };
}

function referenceField(uid, label, referenceTo, opts = {}) {
  const refTo = Array.isArray(referenceTo) ? referenceTo : [referenceTo];
  return {
    data_type: 'reference',
    display_name: label,
    uid,
    reference_to: refTo,
    field_metadata: { ref_multiple: opts.multiple ?? true, description: '' },
    multiple: opts.multiple ?? true,
    mandatory: false,
    unique: false,
    non_localizable: false,
  };
}

function blocksField(uid, label, blockDefs) {
  return {
    data_type: 'blocks',
    display_name: label,
    uid,
    blocks: blockDefs,
    multiple: true,
    mandatory: false,
    unique: false,
    non_localizable: false,
  };
}

// ─── All possible page section block types ────────────────────────────────────

const PAGE_BLOCKS = [
  { uid: 'hero_section',    title: 'Hero',             reference_to: 'hero_section' },
  { uid: 'services_grid',   title: 'Services Grid',    reference_to: 'services_grid' },
  { uid: 'clients_grid',    title: 'Clients Grid',     reference_to: 'clients_grid' },
  { uid: 'story_section',   title: 'Company Story',    reference_to: 'story_section' },
  { uid: 'insights_teaser', title: 'Insights Teaser',  reference_to: 'insights_teaser' },
  { uid: 'insights_grid',   title: 'Insights Grid',    reference_to: 'insights_grid' },
  { uid: 'rich_text',       title: 'Rich Text',        reference_to: 'rich_text' },
  { uid: 'cta_banner',      title: 'CTA Banner',       reference_to: 'cta_banner' },
];

// ─── Global Field definitions ─────────────────────────────────────────────────

const GLOBAL_FIELDS = [
  {
    title: 'Hero Section',
    uid: 'hero_section',
    schema: [
      tf('eyebrow', 'Eyebrow Text'),
      tf('headline', 'Headline', { mandatory: true }),
      tf('subheadline', 'Subheadline'),
      tf('primary_cta_label', 'Primary CTA Label'),
      tf('primary_cta_url', 'Primary CTA URL'),
      tf('secondary_cta_label', 'Secondary CTA Label'),
      tf('secondary_cta_url', 'Secondary CTA URL'),
      ff('hero_image', 'Hero Image'),
      dropdown('text_position', 'Text Position', ['left', 'center', 'right']),
      dropdown('text_alignment', 'Text Alignment', ['left', 'center', 'right']),
    ],
  },
  {
    title: 'Services Grid',
    uid: 'services_grid',
    schema: [
      tf('headline', 'Headline', { mandatory: true }),
      tf('tagline', 'Tagline'),
      nf('limit', 'Services Limit'),
      referenceField('services', 'Services (leave empty for all)', 'service'),
    ],
  },
  {
    title: 'Clients Grid',
    uid: 'clients_grid',
    schema: [
      tf('headline', 'Headline', { mandatory: true }),
      tf('tagline', 'Tagline'),
      referenceField('clients', 'Clients (leave empty for all)', 'client_segment'),
    ],
  },
  {
    title: 'Company Story Section',
    uid: 'story_section',
    schema: [
      tf('eyebrow', 'Eyebrow Text'),
      tf('headline', 'Headline', { mandatory: true }),
      tf('body', 'Body Text'),
      tf('cta_label', 'CTA Label'),
      tf('cta_url', 'CTA URL'),
      tf('since_year', 'Founded Year'),
      group('stats', 'Stats', [
        tf('value', 'Value'),
        tf('label', 'Label'),
      ], true),
    ],
  },
  {
    title: 'Insights Teaser',
    uid: 'insights_teaser',
    schema: [
      tf('headline', 'Headline', { mandatory: true }),
      tf('tagline', 'Tagline'),
      tf('cta_label', 'CTA Label'),
    ],
  },
  {
    title: 'Insights Grid',
    uid: 'insights_grid',
    schema: [
      tf('headline', 'Section Headline', { mandatory: true }),
      referenceField('insights', 'Insights (leave empty for all)', 'insight'),
    ],
  },
  {
    title: 'Rich Text',
    uid: 'rich_text',
    schema: [
      tf('heading', 'Section Heading'),
      tf('content', 'Content', { mandatory: true }),
    ],
  },
  {
    title: 'CTA Banner',
    uid: 'cta_banner',
    schema: [
      tf('eyebrow', 'Eyebrow Text'),
      tf('headline', 'Headline', { mandatory: true }),
      tf('body', 'Body Text'),
      tf('cta_label', 'CTA Label'),
      tf('cta_url', 'CTA URL'),
      dropdown('background', 'Background Color', ['dark', 'green', 'light']),
    ],
  },
  {
    title: 'Contact Sidebar',
    uid: 'contact_sidebar',
    schema: [
      tf('heading', 'Heading'),
      tf('body', 'Body Text'),
      tf('primary_cta_label', 'Primary CTA Label'),
      tf('primary_cta_url', 'Primary CTA URL'),
      tf('secondary_cta_label', 'Secondary CTA Label'),
      tf('secondary_cta_url', 'Secondary CTA URL'),
    ],
  },
];

// ─── Content Type definitions ─────────────────────────────────────────────────

const CONTENT_TYPES = [
  {
    title: 'General Settings',
    uid: 'general_settings',
    description: 'Site-wide settings and footer information',
    schema: [
      tf('title', 'Title', { mandatory: true }),
      tf('company_name', 'Company Name'),
      tf('copyright_text', 'Copyright Text'),
      tf('contact_email', 'Contact Email'),
      tf('linkedin_url', 'LinkedIn URL'),
      tf('instagram_url', 'Instagram URL'),
    ],
    options: { singleton: true, is_page: false, title: 'title', publishable: true },
  },

  {
    title: 'Navigation',
    uid: 'navigation',
    description: 'Main site navigation links',
    schema: [
      tf('title', 'Title', { mandatory: true }),
      group('nav_items', 'Nav Items', [
        tf('label', 'Label', { mandatory: true }),
        tf('url', 'URL'),
      ], true),
      group('utility_links', 'Utility Links', [
        tf('label', 'Label'),
        tf('url', 'URL'),
      ], true),
    ],
    options: { singleton: true, is_page: false, title: 'title', publishable: true },
  },

  {
    title: 'Homepage',
    uid: 'homepage',
    description: 'Homepage content and sections',
    schema: [
      tf('title', 'Title', { mandatory: true }),
      urlField(),
      blocksField('sections', 'Sections', PAGE_BLOCKS),
    ],
    options: { singleton: true, is_page: true, title: 'title', url_pattern: '/', publishable: true },
  },

  {
    title: 'Page',
    uid: 'page',
    description: 'Generic page built with modular sections',
    schema: [
      tf('title', 'Title', { mandatory: true }),
      urlField(),
      tf('slug', 'Slug', { unique: true }),
      blocksField('sections', 'Sections', PAGE_BLOCKS),
    ],
    options: {
      singleton: false,
      is_page: true,
      title: 'title',
      sub_title: ['slug'],
      url_pattern: '/:slug',
      publishable: true,
    },
  },

  {
    title: 'Service',
    uid: 'service',
    description: 'Individual services offered by Citco',
    schema: [
      tf('title', 'Title', { mandatory: true }),
      urlField(),
      tf('slug', 'Slug', { unique: true }),
      tf('tagline', 'Tagline'),
      tf('short_description', 'Short Description'),
      tf('full_description', 'Full Description'),
      ff('featured_image', 'Featured Image'),
      nf('order', 'Display Order'),
      tf('related_headline', 'Related Services Headline'),
      globalFieldRef('contact_sidebar', 'Contact Sidebar', 'contact_sidebar'),
    ],
    options: {
      singleton: false,
      is_page: true,
      title: 'title',
      sub_title: ['slug'],
      url_pattern: '/our-services/:slug',
      publishable: true,
    },
  },

  {
    title: 'Client Segment',
    uid: 'client_segment',
    description: 'Client categories served by Citco',
    schema: [
      tf('title', 'Title', { mandatory: true }),
      tf('slug', 'Slug', { unique: true }),
      tf('tagline', 'Tagline'),
      tf('description', 'Description'),
      ff('featured_image', 'Featured Image'),
    ],
    options: { singleton: false, is_page: false, title: 'title', publishable: true },
  },

  {
    title: 'Insight',
    uid: 'insight',
    description: 'News articles, thought leadership, and publications',
    schema: [
      tf('title', 'Title', { mandatory: true }),
      urlField(),
      tf('slug', 'Slug', { unique: true }),
      dropdown('insight_type', 'Type', ['News', 'Thoughts', 'Publications'], true),
      tf('excerpt', 'Excerpt'),
      tf('content', 'Content'),
      ff('featured_image', 'Featured Image'),
      tf('author', 'Author'),
      df('publish_date', 'Publish Date'),
      tf('more_insights_headline', 'More Insights Headline'),
    ],
    options: {
      singleton: false,
      is_page: true,
      title: 'title',
      sub_title: ['slug'],
      url_pattern: '/insights/:slug',
      publishable: true,
    },
  },
];

// ─── Entry data ───────────────────────────────────────────────────────────────

const SIDEBAR_DEFAULT = {
  heading: 'Get in touch',
  body: 'Speak with our specialists to learn how we can support your specific needs.',
  primary_cta_label: 'Contact Us',
  primary_cta_url: '/contact',
  secondary_cta_label: 'View All Services',
  secondary_cta_url: '/our-services',
};

const ENTRIES = {
  general_settings: [{
    title: 'General Settings',
    company_name: 'The Citco Group Limited',
    copyright_text: '© 2026, The Citco Group Limited',
    contact_email: 'info@citco.com',
    linkedin_url: 'https://www.linkedin.com/company/citco',
    instagram_url: 'https://www.instagram.com/citcogroup',
  }],

  navigation: [{
    title: 'Main Navigation',
    nav_items: [
      { label: 'Our Story', url: '/our-story' },
      { label: 'Our Services', url: '/our-services' },
      { label: 'Our Clients', url: '/our-clients' },
      { label: 'Insights', url: '/insights' },
      { label: 'Careers', url: '/careers' },
    ],
    utility_links: [
      { label: 'Contact Us', url: '/contact' },
      { label: 'Client Login', url: '#' },
    ],
  }],

  homepage: [{
    title: 'Homepage',
    url: '/',
    sections: [
      {
        hero_section: {
          eyebrow: 'The Citco Group',
          headline: 'Your foundation for growth',
          subheadline: "Because growth isn't optional, it's essential",
          primary_cta_label: 'Discover Our Services',
          primary_cta_url: '/our-services',
          secondary_cta_label: 'Our Story',
          secondary_cta_url: '/our-story',
        },
      },
      {
        insights_teaser: {
          headline: 'Get the latest market insights',
          tagline: 'Sector-leading research, expert perspectives, and the latest news from across the alternative investment industry.',
          cta_label: 'View All Insights',
        },
      },
      {
        services_grid: {
          headline: 'More than providers. True partners',
          tagline: "We offer a comprehensive suite of services tailored to meet the complex demands of today's alternative investment industry.",
          limit: 8,
        },
      },
      {
        clients_grid: {
          headline: 'Conquering complexity',
          tagline: "Serving the world's leading financial institutions across every client segment, from asset managers to corporates.",
        },
      },
      {
        story_section: {
          eyebrow: 'Our Story',
          headline: 'Since 1948, we have shaped and pioneered the fund administration sector',
          body: 'For over 75 years, Citco has been at the forefront of independent fund administration. We combine decades of expertise with cutting-edge technology to provide unmatched service to our clients globally across 36 countries.',
          cta_label: 'Discover Our Story',
          cta_url: '/our-story',
          since_year: '1948',
          stats: [
            { value: '7,000+', label: 'Professionals' },
            { value: '36', label: 'Countries' },
            { value: '$1.8T', label: 'Assets Served' },
          ],
        },
      },
      {
        insights_grid: {
          headline: 'Latest Insights',
        },
      },
    ],
  }],

  page: [
    {
      title: 'Our Services',
      url: '/our-services',
      slug: 'our-services',
      sections: [
        {
          hero_section: {
            eyebrow: 'What We Do',
            headline: 'Our Services',
            subheadline: 'More than providers. True partners. We offer a comprehensive suite of services tailored to the alternative investment industry.',
          },
        },
        {
          services_grid: {
            headline: 'Our Services',
            tagline: 'A comprehensive suite of services tailored to meet the complex demands of the alternative investment industry.',
          },
        },
        {
          cta_banner: {
            headline: 'Ready to get started?',
            body: 'Contact our team to discuss how we can support your specific needs.',
            cta_label: 'Contact Us Today',
            cta_url: '/contact',
            background: 'green',
          },
        },
      ],
    },
    {
      title: 'Our Clients',
      url: '/our-clients',
      slug: 'our-clients',
      sections: [
        {
          hero_section: {
            eyebrow: 'Who We Serve',
            headline: 'Our Clients',
            subheadline: "Conquering complexity. We serve the world's leading financial institutions across every client segment.",
          },
        },
        {
          cta_banner: {
            headline: 'Not sure where you fit?',
            body: 'Our team will help you find the right solution for your specific situation.',
            cta_label: 'Speak to an Expert',
            cta_url: '/contact',
            background: 'dark',
          },
        },
      ],
    },
    {
      title: 'Insights',
      url: '/insights',
      slug: 'insights',
      sections: [
        {
          hero_section: {
            eyebrow: 'Knowledge Hub',
            headline: 'Insights',
            subheadline: 'Sector-leading research, expert perspectives, and the latest news from across the alternative investment industry.',
          },
        },
        {
          insights_grid: {
            headline: 'All Insights',
          },
        },
      ],
    },
  ],

  service: [
    {
      title: 'Fund Administration',
      url: '/our-services/fund-administration',
      slug: 'fund-administration',
      tagline: 'Pioneer in independent fund administration',
      short_description: 'Citco is a pioneer in independent fund administration for the alternative investment industry, offering scalable and innovative solutions to meet your specific needs.',
      full_description: 'For over 75 years, Citco has been the leading independent fund administrator for the alternative investment industry. Our scalable, technology-driven solutions support hedge funds, private equity, real assets, and more. We provide comprehensive middle-to-back office services that allow fund managers to focus on what they do best — generating alpha.',
      order: 1,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Banking',
      url: '/our-services/banking',
      slug: 'banking',
      tagline: 'Integrated financial solutions',
      short_description: 'Integrated payment solutions, lending, and foreign exchange services for alternative investment funds and financial institutions.',
      full_description: 'Citco Bank offers comprehensive banking services tailored to the alternative investment industry. From multicurrency accounts and payment processing to FX solutions and lending facilities, our banking division provides the financial infrastructure that modern funds require.',
      order: 2,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Direct Lending and Capital Advisory',
      url: '/our-services/direct-lending-and-capital-advisory',
      slug: 'direct-lending-and-capital-advisory',
      tagline: 'Strategic capital solutions',
      short_description: 'Professional team handling direct lending and structuring of debt and equity capital for alternative funds and investors.',
      full_description: "Citco's Direct Lending and Capital Advisory team provides sophisticated capital solutions for alternative investment funds and their portfolio companies. We structure bespoke debt and equity arrangements, leveraging our deep market expertise and global network.",
      order: 3,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Loan Servicing Solutions',
      url: '/our-services/loan-servicing-solutions',
      slug: 'loan-servicing-solutions',
      tagline: 'Fully-integrated loan servicing',
      short_description: 'A fully-integrated Loan Servicing and Agency offering for loan originators and investors.',
      full_description: 'Our Loan Servicing Solutions team provides end-to-end administration for complex loan facilities. From facility agency to portfolio administration, we handle every aspect of the loan lifecycle with precision and expertise.',
      order: 4,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Middle Office Solutions',
      url: '/our-services/middle-office-solutions',
      slug: 'middle-office-solutions',
      tagline: 'Expert middle office support',
      short_description: 'Expert teams combined with proprietary technology for reliable middle office support across all asset classes.',
      full_description: "Citco's Middle Office Solutions combine experienced professionals with proprietary technology to deliver seamless portfolio reporting, reconciliation, and data management services. We provide the operational backbone that investment managers need to scale efficiently.",
      order: 5,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Tax and Regulatory',
      url: '/our-services/tax-and-regulatory',
      slug: 'tax-and-regulatory',
      tagline: 'Global compliance expertise',
      short_description: 'Timely tax reporting and regulatory reporting services leveraging overlaps in global requirements.',
      full_description: "Navigating the complex global tax and regulatory landscape requires specialist expertise. Citco's Tax and Regulatory team delivers accurate, timely reporting across jurisdictions — from FATCA and CRS to Form PF and AIFMD — helping you stay compliant worldwide.",
      order: 6,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Corporate Secretarial and Management Services',
      url: '/our-services/corporate-secretarial-and-management-services',
      slug: 'corporate-secretarial-and-management-services',
      tagline: 'Full corporate governance support',
      short_description: 'Full corporate secretarial suite for regulated entities, customizable to board requirements.',
      full_description: "Citco's Corporate Secretarial and Management Services provide comprehensive governance support for fund structures, SPVs, and corporate entities. We handle board administration, statutory filings, and compliance documentation across multiple jurisdictions.",
      order: 7,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Entity Incorporation and Lifecycle Services',
      url: '/our-services/entity-incorporation-lifecycle-services',
      slug: 'entity-incorporation-lifecycle-services',
      tagline: 'From inception to dissolution',
      short_description: 'Expertise in entity life cycle management covering incorporation through liquidation across global jurisdictions.',
      full_description: 'Whether incorporating a new fund vehicle or managing a complex liquidation, Citco\'s entity specialists guide clients through every stage of the corporate lifecycle. We operate across major financial jurisdictions including Cayman Islands, Luxembourg, Ireland, and beyond.',
      order: 8,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Registered Office and Agent Services',
      url: '/our-services/registered-office-agent-services',
      slug: 'registered-office-agent-services',
      tagline: 'Global registered office network',
      short_description: 'Global registered office address support across multiple worldwide locations.',
      full_description: 'Citco provides registered office and agent services in all major fund domiciles. Our global network ensures your entities maintain the highest standards of local compliance while benefiting from the security of a world-class service provider.',
      order: 9,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Global Entity Portfolio Management',
      url: '/our-services/global-entity-portfolio-management',
      slug: 'global-entity-portfolio-management',
      tagline: 'Mercator® by Citco',
      short_description: 'Mercator® by Citco provides specialized entity portfolio management services for complex, multi-jurisdiction structures.',
      full_description: 'Mercator® by Citco is our proprietary entity management platform for organizations with complex global corporate structures. It provides a centralized view of entity data, compliance deadlines, and ownership structures — turning complexity into clarity.',
      order: 10,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
    {
      title: 'Corporate Accounting and Bookkeeping',
      url: '/our-services/corporate-accounting-and-bookkeeping',
      slug: 'corporate-accounting-and-bookkeeping',
      tagline: 'Accurate financial record-keeping',
      short_description: 'Financial record preparation adhering to current accounting standards for corporate entities and fund structures.',
      full_description: "Citco's Corporate Accounting team provides precise bookkeeping and financial reporting services for corporate entities, holding companies, and special purpose vehicles. We work to IFRS, US GAAP, and local accounting standards.",
      order: 11,
      related_headline: 'Related Services',
      contact_sidebar: { ...SIDEBAR_DEFAULT },
    },
  ],

  client_segment: [
    {
      title: 'Asset Owners',
      slug: 'asset-owners',
      tagline: 'Institutional investment excellence',
      description: 'Pension funds, sovereign wealth funds, endowments, and family offices trust Citco to manage and administer their alternative investment allocations with precision and transparency.',
    },
    {
      title: 'Alternative Asset Managers',
      slug: 'alternative-asset-managers',
      tagline: "Partner to the world's top funds",
      description: "From startup hedge funds to the world's largest private equity firms, Citco serves alternative asset managers across every strategy and asset class, providing the operational infrastructure they need to succeed.",
    },
    {
      title: 'Banking Clients',
      slug: 'banking-clients',
      tagline: 'Specialized financial services',
      description: 'Banks and financial institutions rely on Citco for specialized fund administration, loan servicing, and corporate services that complement their own offerings and extend their reach.',
    },
    {
      title: 'Investors',
      slug: 'investors',
      tagline: 'Transparency and access',
      description: "Individual and institutional investors in alternative funds benefit from Citco's independent reporting, investor services, and portal access — providing the transparency and confidence they need.",
    },
    {
      title: 'Corporates',
      slug: 'corporates',
      tagline: 'Beyond finance',
      description: "Multinational corporations and financial institutions use Citco's entity management, corporate secretarial, and accounting services to manage their complex global structures efficiently.",
    },
  ],

  insight: [
    {
      title: 'Citco Wins Best Fund Administrator at HFM Global Awards 2025',
      url: '/insights/citco-wins-hfm-global-awards-2025',
      slug: 'citco-wins-hfm-global-awards-2025',
      insight_type: 'News',
      excerpt: 'Citco has been recognized as Best Fund Administrator at the prestigious HFM Global Awards for the seventh consecutive year, underscoring our commitment to excellence.',
      content: 'Citco is proud to announce that we have once again been named Best Fund Administrator at the HFM Global Awards ceremony held in New York. This recognition reflects the dedication of our over 7,000 employees across 36 countries who work tirelessly to deliver exceptional service to our clients.\n\nThe HFM Global Awards are among the most prestigious in the hedge fund industry, with winners selected based on rigorous peer review and client feedback. This seventh consecutive win reaffirms Citco\'s position as the premier independent fund administrator in the alternative investment industry.',
      author: 'Citco Communications',
      publish_date: '2025-11-15',
      more_insights_headline: 'More Insights',
    },
    {
      title: 'Citco Expands Singapore Operations to Meet Growing Asia-Pacific Demand',
      url: '/insights/citco-expands-singapore-operations-2025',
      slug: 'citco-expands-singapore-operations-2025',
      insight_type: 'News',
      excerpt: 'Citco announces significant expansion of its Singapore office, adding over 150 professionals to support the rapidly growing alternative investment sector in Asia-Pacific.',
      content: 'Citco is expanding its Singapore operations significantly, reflecting strong demand from Asia-Pacific-based fund managers and investors. The expansion will add more than 150 new positions across fund administration, middle office, and technology functions.\n\nSingapore has emerged as the leading hub for alternative investments in Southeast Asia, and this expansion reflects our long-term commitment to serving the region\'s growing financial services community.',
      author: 'Citco Communications',
      publish_date: '2025-09-22',
      more_insights_headline: 'More Insights',
    },
    {
      title: 'The Evolution of Independent Fund Administration in a Digital Age',
      url: '/insights/evolution-of-fund-administration-digital-age',
      slug: 'evolution-of-fund-administration-digital-age',
      insight_type: 'Thoughts',
      excerpt: 'As technology reshapes the alternative investment landscape, independent fund administrators must evolve or risk obsolescence. We explore what the future holds.',
      content: 'The role of the independent fund administrator has never been more critical — or more challenged — than it is today. Advances in artificial intelligence, cloud computing, and distributed ledger technology are fundamentally changing how fund data is managed, processed, and reported.\n\nAt Citco, we believe that technology should enhance, not replace, the human expertise that has made independent administration valuable. The future belongs to administrators who can seamlessly blend technological innovation with deep domain knowledge and genuine client partnership.\n\nKey trends reshaping our industry include real-time NAV calculation, AI-powered reconciliation, and blockchain-based asset tracking. We are investing heavily in all three areas while maintaining the client-centric approach that has driven our growth for over 75 years.',
      author: 'Christopher Allen, Chief Technology Officer',
      publish_date: '2025-10-08',
      more_insights_headline: 'More Insights',
    },
    {
      title: 'Private Credit: Navigating the New Lending Landscape',
      url: '/insights/private-credit-navigating-new-lending-landscape',
      slug: 'private-credit-navigating-new-lending-landscape',
      insight_type: 'Thoughts',
      excerpt: 'With traditional bank lending constrained, private credit has emerged as a dominant force in corporate finance. What does this mean for fund administrators and investors?',
      content: 'Private credit has experienced explosive growth over the past decade, with assets under management exceeding $1.7 trillion globally. As banks have retreated from certain segments of the lending market due to regulatory pressures, private credit funds have stepped in to fill the gap.\n\nThis growth presents both opportunities and challenges for service providers like Citco. The complexity of private credit structures — from direct lending to CLOs and structured credit — demands sophisticated administrative capabilities that go far beyond traditional hedge fund administration.\n\nOur Loan Servicing Solutions division has invested extensively in the systems and expertise needed to administer these complex instruments efficiently and accurately.',
      author: 'Sarah Mitchell, Head of Direct Lending',
      publish_date: '2025-08-19',
      more_insights_headline: 'More Insights',
    },
    {
      title: 'Global Hedge Fund Industry Report: H1 2025',
      url: '/insights/global-hedge-fund-industry-report-h1-2025',
      slug: 'global-hedge-fund-industry-report-h1-2025',
      insight_type: 'Publications',
      excerpt: 'Our comprehensive semi-annual analysis of global hedge fund performance, flows, and industry trends for the first half of 2025.',
      content: "Citco's Global Hedge Fund Industry Report for H1 2025 provides a comprehensive analysis of performance, capital flows, and emerging trends across the alternative investment landscape.\n\nKey findings: global hedge fund assets reached $4.3 trillion, a 12% increase year-over-year; macro strategies outperformed with average returns of 14.2%; net inflows turned positive for the first time since 2021 at $47 billion; and ESG-focused strategies attracted a disproportionate share of new allocations.\n\nThis report draws on data from over 3,000 funds administered by Citco, providing an unparalleled view into the health and direction of the global hedge fund industry.",
      author: 'Citco Research Team',
      publish_date: '2025-09-05',
      more_insights_headline: 'More Insights',
    },
    {
      title: "Private Equity Waterfall Mechanics: A Practitioner's Guide",
      url: '/insights/private-equity-waterfall-mechanics-guide',
      slug: 'private-equity-waterfall-mechanics-guide',
      insight_type: 'Publications',
      excerpt: 'An in-depth analysis of carried interest and waterfall distribution mechanics across European and American waterfall structures, with practical implications for GPs and LPs.',
      content: "Understanding private equity waterfall mechanics is essential for both general partners and limited partners in alternative investment funds. This publication provides a detailed examination of both American and European waterfall structures, including the nuances of preferred return calculations, catch-up provisions, and carried interest clawback mechanisms.\n\nOur analysis covers 500+ private equity partnerships administered by Citco, revealing significant variation in waterfall structures and highlighting the importance of precision in distribution calculations. We also examine emerging trends including hybrid waterfall structures and the growing use of NAV lending facilities that interact with waterfall mechanics.",
      author: 'Citco Research Team',
      publish_date: '2025-07-14',
      more_insights_headline: 'More Insights',
    },
  ],
};

// ─── Runner ───────────────────────────────────────────────────────────────────

async function deleteAllGlobalFields() {
  console.log('\n🗑  Deleting existing global fields...');
  const res = await cma('GET', '/global_fields?count=100').catch(() => ({ global_fields: [] }));
  const gfs = res.global_fields || [];
  if (gfs.length === 0) { console.log('   (none found)'); return; }
  for (const gf of gfs) {
    console.log(`   Deleting ${gf.uid}...`);
    try {
      await cma('DELETE', `/global_fields/${gf.uid}`);
      console.log(`   ✅ ${gf.uid}`);
    } catch (e) {
      console.log(`   ⚠️  ${gf.uid}: ${e.message}`);
    }
    await sleep(500);
  }
}

async function deleteAllContentTypes() {
  console.log('\n🗑  Deleting existing content types...');
  const res = await cma('GET', '/content_types?count=100').catch(() => ({ content_types: [] }));
  const cts = res.content_types || [];
  if (cts.length === 0) { console.log('   (none found)'); return; }
  for (const ct of cts) {
    console.log(`   Deleting ${ct.uid}...`);
    try {
      await cma('DELETE', `/content_types/${ct.uid}?force=true`);
      console.log(`   ✅ ${ct.uid}`);
    } catch (e) {
      console.log(`   ⚠️  ${ct.uid}: ${e.message}`);
    }
    await sleep(600);
  }
}


// GFs that reference CTs (must be created after those CTs)
const CT_REFERENCING_GF_UIDS = new Set(['services_grid', 'clients_grid', 'insights_grid']);
// CTs that must exist before CT-referencing GFs (but may need non-CT GFs)
const BASE_CT_UIDS = new Set(['service', 'client_segment', 'insight']);

async function createContentTypesBatch(label, filter) {
  console.log(`\n📋 Creating ${label} content types...`);
  for (const ct of CONTENT_TYPES.filter(filter)) {
    process.stdout.write(`   ${ct.uid}... `);
    try {
      await cma('POST', '/content_types', { content_type: ct });
      console.log('✅');
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
    await sleep(800);
  }
}

async function createGlobalFieldsBatch(label, filter) {
  console.log(`\n🧩 Creating ${label} global fields...`);
  for (const gf of GLOBAL_FIELDS.filter(filter)) {
    process.stdout.write(`   ${gf.uid}... `);
    try {
      await cma('POST', '/global_fields', { global_field: gf });
      console.log('✅');
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
    await sleep(600);
  }
}

async function createAndPublishEntries() {
  console.log('\n📝 Creating entries...');
  for (const [ctUid, entries] of Object.entries(ENTRIES)) {
    console.log(`\n  [${ctUid}]`);
    for (const data of entries) {
      process.stdout.write(`   "${data.title}"... `);
      try {
        const created = await cma('POST', `/content_types/${ctUid}/entries?locale=en-us`, { entry: data });
        const uid = created.entry?.uid;
        if (!uid) throw new Error('no uid returned');
        await sleep(400);
        await cma('POST', `/content_types/${ctUid}/entries/${uid}/publish`, {
          entry: { environments: [ENVIRONMENT], locales: ['en-us'] },
        });
        console.log(`✅ (${uid})`);
      } catch (e) {
        console.log(`❌ ${e.message}`);
      }
      await sleep(600);
    }
  }
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   Citco Contentstack Stack Setup     ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`Stack:       ${API_KEY}`);
  console.log(`Environment: ${ENVIRONMENT}`);

  await deleteAllContentTypes();
  await sleep(1000);
  await deleteAllGlobalFields();
  await sleep(1000);
  // Phase 1: GFs with no CT deps (contact_sidebar, hero_section, etc.)
  await createGlobalFieldsBatch('base', gf => !CT_REFERENCING_GF_UIDS.has(gf.uid));
  await sleep(1000);
  // Phase 2: base CTs (service/client_segment/insight) — may use contact_sidebar GF
  await createContentTypesBatch('base', ct => BASE_CT_UIDS.has(ct.uid));
  await sleep(1000);
  // Phase 3: GFs that reference CTs (services_grid, clients_grid, insights_grid)
  await createGlobalFieldsBatch('reference', gf => CT_REFERENCING_GF_UIDS.has(gf.uid));
  await sleep(1000);
  // Phase 4: page CTs (homepage, page, general_settings, navigation)
  await createContentTypesBatch('page', ct => !BASE_CT_UIDS.has(ct.uid));
  await sleep(1000);
  await createAndPublishEntries();

  console.log('\n\n✅ Done! Run `npm run dev` to start the app.\n');
}

main().catch(err => { console.error('\n💥', err); process.exit(1); });
