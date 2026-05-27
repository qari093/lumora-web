import { validateMediaAssetForLumora } from "@/src/lib/content/legal/assetClearance";
import { validateSourceClipQuality } from "@/src/lib/content/quality/sourceClipGate";
import type { RawSourceClip, PipelineResult } from "./types";

export function runLumoraPipeline(items: RawSourceClip[]): PipelineResult {
  const accepted: RawSourceClip[] = [];
  const rejected: { item: RawSourceClip; reasons: string[] }[] = [];

  for (const item of items) {
    const legal = validateMediaAssetForLumora({
      ...item,
      hasAudio: Boolean(item.hasAudio),
      playableUrl: item.playableUrl || item.localUrl || item.embedUrl,
      commercialUse: true,
    });

    const quality = validateSourceClipQuality({
      ...item,
      hasAudio: Boolean(item.hasAudio),
      playableUrl: item.playableUrl,
      localUrl: item.localUrl,
      embedUrl: item.embedUrl,
      mimeType: item.mimeType,
      durationSeconds: item.durationSeconds,
    });

    if (legal.ok && quality.ok) {
      accepted.push(item);
    } else {
      rejected.push({
        item,
        reasons: [...legal.reasons, ...quality.reasons],
      });
    }
  }

  return { accepted, rejected };
}
