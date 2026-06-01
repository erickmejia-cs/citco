import { jsonToHtml } from '@contentstack/json-rte-serializer';
import type { RichTextData } from '@/types';

interface Props {
  block: RichTextData | null | undefined;
  cslpPrefix?: string;
}

function cslp(prefix?: string, field?: string): Record<string, string> {
  if (!prefix || !field) return {};
  return { 'data-cslp': `${prefix}.${field}` };
}

function safeJsonToHtml(content: unknown): string {
  if (!content || typeof content !== 'object') return '';
  try {
    return jsonToHtml(content as any) ?? '';
  } catch {
    return '';
  }
}

export default function RichTextBlock({ block, cslpPrefix }: Props) {
  if (!block) return null;

  const html = safeJsonToHtml(block.content);

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
        {/* data-cslp must be on a wrapper, not on the dangerouslySetInnerHTML
            element — the VB SDK and React would otherwise fight over innerHTML. */}
        <div {...cslp(cslpPrefix, 'content')}>
          <div className="rte-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </section>
  );
}
