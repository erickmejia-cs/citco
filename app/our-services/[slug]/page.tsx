import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServiceBySlug, getServiceSlugs, getServices } from '@/lib/contentstack';
import ServiceDetailLiveView from '@/components/ServiceDetailLiveView';

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) return {};
  return {
    title: `${service.title} | Citco`,
    description: service.short_description,
  };
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { live_preview?: string };
}) {
  const hash = searchParams.live_preview;

  const [service, allServices] = await Promise.all([
    getServiceBySlug(params.slug, hash),
    getServices(),
  ]);

  if (!service) notFound();

  const related = allServices.filter(s => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/our-services" className="hover:text-white transition-colors">Our Services</Link>
            <span>/</span>
            <span className="text-white/70">{service.title}</span>
          </nav>
          <p className="text-xs font-bold tracking-widest uppercase text-[#007A42] mb-4">Our Services</p>
          <h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            data-cslp={`service.${(service as any).uid}.en-us.title`}
          >
            {service.title}
          </h1>
          <p
            className="text-xl text-white/60 max-w-2xl"
            data-cslp={`service.${(service as any).uid}.en-us.tagline`}
          >
            {service.tagline}
          </p>
        </div>
      </section>

      <ServiceDetailLiveView initialData={service} related={related} />
    </>
  );
}
