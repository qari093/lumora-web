import { guardedJson } from '@/lib/api/guardedJson';
import { buildBaseContent } from '@/lib/content/schema';
import { attachSaturationIndex } from '@/lib/content/saturation';
import { readTrustedSignalStore } from '@/lib/trust/filterLowTrust';

export const dynamic = 'force-dynamic';

export async function GET() {
  const trusted = await readTrustedSignalStore();
  const first =
    Array.isArray(trusted.signals) && trusted.signals.length ? (trusted.signals[0] as any) : null;

  const now = Date.now();
  const title = first?.title || 'Saturation Sample';
  const base = {
    ...buildBaseContent({
      id: 'content_saturation_sample_001',
      title: first?.title || 'Saturation Sample',
      summary: first?.summary || 'Saturation attachment sample',
    }),
    type: 'signal_card' as const,
    title,
    createdAt: now,
    updatedAt: now,
  };

  const content = attachSaturationIndex(
    base,
    typeof first?.derivedSaturationIndex === 'number'
      ? first.derivedSaturationIndex
      : typeof first?.saturationScore === 'number'
        ? first.saturationScore
        : 0,
  );

  return guardedJson('api.content.saturation', {
    ok: true,
    content,
    ts: Date.now(),
  });
}
