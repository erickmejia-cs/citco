import { getClientSegments, getPageBySlug } from '@/lib/contentstack';
import CtaBannerBlock from '@/components/blocks/CtaBannerBlock';
import type { HeroSectionData, CtaBannerData } from '@/types';

export const revalidate = 60;

export const metadata = {
  title: 'Our Clients | Citco',
  description: "Citco serves the world's leading financial institutions across every client segment.",
};

export default async function ClientsPage() {
  const [clients, pageData] = await Promise.all([
    getClientSegments(),
    getPageBySlug('our-clients'),
  ]);

  const pageUid: string | undefined = (pageData as any)?.uid;
  const heroIdx = pageData?.sections.findIndex(s => 'hero_section' in s) ?? -1;
  const ctaIdx = pageData?.sections.findIndex(s => 'cta_banner' in s) ?? -1;
  const hero: HeroSectionData | undefined = heroIdx >= 0 ? pageData?.sections[heroIdx]?.hero_section : undefined;
  const cta: CtaBannerData | undefined = ctaIdx >= 0 ? pageData?.sections[ctaIdx]?.cta_banner : undefined;

  return (
    <>
      {hero && (
        <section className="bg-[#0A1628] pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {hero.eyebrow && (
              <p
                className="text-xs font-bold tracking-widest uppercase text-[#007A42] mb-4"
                data-cslp={pageUid && heroIdx >= 0 ? `page.${pageUid}.en-us.sections.${heroIdx}.hero_section.eyebrow` : undefined}
              >
                {hero.eyebrow}
              </p>
            )}
            {hero.headline && (
              <h1
                className="text-4xl lg:text-6xl font-bold text-white mb-6"
                data-cslp={pageUid && heroIdx >= 0 ? `page.${pageUid}.en-us.sections.${heroIdx}.hero_section.headline` : undefined}
              >
                {hero.headline}
              </h1>
            )}
            {hero.subheadline && (
              <p
                className="text-xl text-white/60 max-w-2xl leading-relaxed"
                data-cslp={pageUid && heroIdx >= 0 ? `page.${pageUid}.en-us.sections.${heroIdx}.hero_section.subheadline` : undefined}
              >
                {hero.subheadline}
              </p>
            )}
          </div>
        </section>
      )}

      {clients.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="space-y-px">
              {clients.map((client, i) => (
                <div
                  key={(client as any).uid ?? client.slug}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${i % 2 === 0 ? 'bg-[#F5F6F7]' : 'bg-white'}`}
                >
                  <div className={`${i % 2 === 0 ? 'bg-[#0A1628]' : 'bg-[#005B30]'} p-16 flex flex-col justify-center ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <span className="text-6xl font-bold text-white/10 mb-4 select-none">0{i + 1}</span>
                    {client.title && <h2 className="text-3xl font-bold text-white mb-3">{client.title}</h2>}
                    {client.tagline && <p className="text-white/60 text-lg">{client.tagline}</p>}
                  </div>
                  <div className="p-16 flex flex-col justify-center">
                    {client.description && <p className="text-gray-600 text-lg leading-relaxed">{client.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {cta && (
        <CtaBannerBlock
          block={cta}
          cslpPrefix={pageUid && ctaIdx >= 0 ? `page.${pageUid}.en-us.sections.${ctaIdx}.cta_banner` : undefined}
        />
      )}
    </>
  );
}
