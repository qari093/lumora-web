import { validateLicense } from "./licenseNormalizer";

export type AttributionInput = {
  sourceId: string;
  sourceName: string;
  title: string;
  creator?: string;
  sourceUrl: string;
  license: string;
};

export type AttributionRecord = {
  required: boolean;
  sourceId: string;
  displayText: string;
  sourceUrl: string;
  license: string;
  valid: boolean;
};

export function buildAttributionRecord(input: AttributionInput): AttributionRecord {
  const decision = validateLicense(input.license);
  const creator = input.creator?.trim();
  const title = input.title?.trim() || "Untitled";
  const source = input.sourceName?.trim() || input.sourceId;

  const displayText = creator
    ? `${title} by ${creator} via ${source} — ${input.license}`
    : `${title} via ${source} — ${input.license}`;

  return {
    required: decision.attributionRequired,
    sourceId: input.sourceId,
    displayText,
    sourceUrl: input.sourceUrl,
    license: input.license,
    valid: decision.ok && Boolean(input.sourceUrl),
  };
}

export function shouldRenderAttribution(record: AttributionRecord): boolean {
  return record.valid && record.required;
}
