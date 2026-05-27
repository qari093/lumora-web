export type NativeUploadInput = {
  title: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  durationSeconds: number;
  rightsConfirmed: boolean;
};

export function validateNativeUploadInput(input: NativeUploadInput): {
  ok: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (!input.title.trim()) reasons.push("missing_title");
  if (!input.filename.trim()) reasons.push("missing_filename");
  if (input.mimeType !== "video/mp4") reasons.push("unsupported_mime");
  if (input.sizeBytes <= 0) reasons.push("invalid_size");
  if (input.durationSeconds < 3 || input.durationSeconds > 120) reasons.push("invalid_duration");
  if (!input.rightsConfirmed) reasons.push("rights_not_confirmed");

  return { ok: reasons.length === 0, reasons };
}
