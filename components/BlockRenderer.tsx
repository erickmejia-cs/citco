import type { PageSection, Service, ClientSegment, Insight } from '@/types';
import HeroBlock from './blocks/HeroBlock';
import ServicesSectionBlock from './blocks/ServicesSectionBlock';
import ClientsSectionBlock from './blocks/ClientsSectionBlock';
import StoryBlock from './blocks/StoryBlock';
import InsightsTeaserBlock from './blocks/InsightsTeaserBlock';
import InsightsGridBlock from './blocks/InsightsGridBlock';
import RichTextBlock from './blocks/RichTextBlock';
import CtaBannerBlock from './blocks/CtaBannerBlock';

interface Props {
  sections: PageSection[];
  contentType: string;
  entryUid?: string;
  services?: Service[];
  clients?: ClientSegment[];
  insights?: Insight[];
}

export default function BlockRenderer({
  sections,
  contentType,
  entryUid,
  services = [],
  clients = [],
  insights = [],
}: Props) {
  const containerCslp = entryUid
    ? `${contentType}.${entryUid}.en-us.sections`
    : undefined;

  return (
    <div {...(containerCslp ? { 'data-cslp': containerCslp } : {})}>
      {sections.map((section, index) => {
        // Delivery SDK returns { blockUid: { ...fields }, _metadata?: {...} }
        const blockType = Object.keys(section).find(k => k !== '_metadata');
        if (!blockType) return null;
        const data = section[blockType];

        // cslpItem: points at sections.N — the SDK uses this to resolve the
        // `sections` field schema (multiple:true), which enables Move/Delete/Add.
        const cslpItem = entryUid
          ? `${contentType}.${entryUid}.en-us.sections.${index}`
          : undefined;

        // cslpPrefix: points at sections.N.blockType — used by block components
        // as the prefix for their individual field tags (e.g. .headline, .eyebrow).
        const cslpPrefix = entryUid
          ? `${contentType}.${entryUid}.en-us.sections.${index}.${blockType}`
          : undefined;

        let blockNode: React.ReactNode;
        switch (blockType) {
          case 'hero_section':
            blockNode = <HeroBlock block={data} cslpPrefix={cslpPrefix} />;
            break;
          case 'services_grid':
            blockNode = <ServicesSectionBlock block={data} services={services} cslpPrefix={cslpPrefix} />;
            break;
          case 'clients_grid':
            blockNode = <ClientsSectionBlock block={data} clients={clients} cslpPrefix={cslpPrefix} />;
            break;
          case 'story_section':
            blockNode = <StoryBlock block={data} cslpPrefix={cslpPrefix} />;
            break;
          case 'insights_teaser':
            blockNode = <InsightsTeaserBlock block={data} cslpPrefix={cslpPrefix} />;
            break;
          case 'insights_grid':
            blockNode = <InsightsGridBlock block={data} insights={insights} cslpPrefix={cslpPrefix} />;
            break;
          case 'rich_text':
            blockNode = <RichTextBlock block={data} cslpPrefix={cslpPrefix} />;
            break;
          case 'cta_banner':
            blockNode = <CtaBannerBlock block={data} cslpPrefix={cslpPrefix} />;
            break;
          default:
            return null;
        }

        return (
          <div key={index} {...(cslpItem ? { 'data-cslp': cslpItem } : {})}>
            {blockNode}
          </div>
        );
      })}
    </div>
  );
}
