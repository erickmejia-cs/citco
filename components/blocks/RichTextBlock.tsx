import type { RichTextData } from '@/types';

interface Props {
  block: RichTextData;
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

export default function RichTextBlock({ block, cslpPrefix }: Props) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {block.heading && (
          <h2
            className="text-3xl font-bold text-[#0A1628] mb-8"
            {...cslp(cslpPrefix, 'heading')}
          >
            {block.heading}
          </h2>
        )}
        <div className="space-y-5">
          {block.content.split('\n\n').map((para, i) => (
            <p
              key={i}
              className="text-gray-600 text-lg leading-relaxed"
              {...(i === 0 ? cslp(cslpPrefix, 'content') : {})}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
