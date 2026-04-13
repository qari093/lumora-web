export type CreatorProfileInput = {
  id: string;
  handle: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  tags?: string[];
  verified?: boolean;
};

export type CreatorProfile = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  tags: string[];
  verified: boolean;
  slug: string;
  createdAt: string;
};

export type CreatorProfileResult =
  | { ok: true; profile: CreatorProfile }
  | {
      ok: false;
      error:
        | "invalid_id"
        | "invalid_handle"
        | "invalid_display_name"
        | "invalid_bio"
        | "invalid_avatar_url";
    };

function slugifyHandle(handle: string): string {
  return handle.trim().toLowerCase().replace(/^@+/, "");
}

function normalizeTags(tags?: string[]): string[] {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 12);
}

export function buildCreatorProfile(input: CreatorProfileInput): CreatorProfileResult {
  const id = input.id?.trim();
  const handle = slugifyHandle(input.handle ?? "");
  const displayName = input.displayName?.trim();
  const bio = (input.bio ?? "").trim();
  const avatarUrl = input.avatarUrl?.trim() || null;

  if (!id || id.length < 2) {
    return { ok: false, error: "invalid_id" };
  }

  if (!handle || !/^[a-z0-9._-]{3,30}$/.test(handle)) {
    return { ok: false, error: "invalid_handle" };
  }

  if (!displayName || displayName.length < 2 || displayName.length > 60) {
    return { ok: false, error: "invalid_display_name" };
  }

  if (bio.length > 280) {
    return { ok: false, error: "invalid_bio" };
  }

  if (avatarUrl && !/^https?:\/\//.test(avatarUrl)) {
    return { ok: false, error: "invalid_avatar_url" };
  }

  return {
    ok: true,
    profile: {
      id,
      handle: `@${handle}`,
      displayName,
      bio,
      avatarUrl,
      tags: normalizeTags(input.tags),
      verified: Boolean(input.verified),
      slug: handle,
      createdAt: new Date().toISOString()
    }
  };
}
