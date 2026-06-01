import { jsonToHtml } from '@contentstack/json-rte-serializer';
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
  const html = block.content ? jsonToHtml(block.content as any) : '';

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
        <div
          className="rte-content"
          dangerouslySetInnerHTML={{ __html: html }}
          {...cslp(cslpPrefix, 'content')}
        />
      </div>
    </section>
  );
}
