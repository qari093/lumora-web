export type UploadVisibility = "public" | "private" | "unlisted";

export type CreatorUploadInput = {
  title: string;
  creatorId: string;
  mediaUrl: string;
  mimeType: string;
  visibility?: UploadVisibility;
  tags?: string[];
};

export type CreatorUploadResult =
  | {
      ok: true;
      upload: {
        title: string;
        creatorId: string;
        mediaUrl: string;
        mimeType: string;
        visibility: UploadVisibility;
        tags: string[];
        status: "queued";
        createdAt: string;
      };
    }
  | {
      ok: false;
      error:
        | "invalid_title"
        | "invalid_creator"
        | "invalid_media_url"
        | "invalid_mime_type"
        | "invalid_visibility";
    };

const ALLOWED_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "image/jpeg",
  "image/png"
]);

const ALLOWED_VISIBILITY = new Set<UploadVisibility>([
  "public",
  "private",
  "unlisted"
]);

function normalizeTags(tags?: string[]): string[] {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => t.trim()).filter(Boolean))].slice(0, 10);
}

export function finalizeCreatorUpload(
  input: CreatorUploadInput
): CreatorUploadResult {
  const title = input.title?.trim();
  const creatorId = input.creatorId?.trim();
  const mediaUrl = input.mediaUrl?.trim();
  const mimeType = input.mimeType?.trim();
  const visibility = input.visibility ?? "public";

  if (!title || title.length < 3 || title.length > 120) {
    return { ok: false, error: "invalid_title" };
  }

  if (!creatorId || creatorId.length < 2) {
    return { ok: false, error: "invalid_creator" };
  }

  if (!mediaUrl || !/^https?:\/\//.test(mediaUrl)) {
    return { ok: false, error: "invalid_media_url" };
  }

  if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
    return { ok: false, error: "invalid_mime_type" };
  }

  if (!ALLOWED_VISIBILITY.has(visibility)) {
    return { ok: false, error: "invalid_visibility" };
  }

  return {
    ok: true,
    upload: {
      title,
      creatorId,
      mediaUrl,
      mimeType,
      visibility,
      tags: normalizeTags(input.tags),
      status: "queued",
      createdAt: new Date().toISOString()
    }
  };
}
