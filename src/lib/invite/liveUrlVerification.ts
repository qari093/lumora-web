export type LiveUrlVerificationInput = {
  canonicalUrl?: string | null;
  ogImageUrl?: string | null;
  goUrl?: string | null;
};

export type LiveUrlVerificationResult =
  | {
      ok: true;
      verification: {
        canonicalUrl: string;
        ogImageUrl: string;
        goUrl: string;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function verifyLiveInviteUrls(
  input: LiveUrlVerificationInput
): LiveUrlVerificationResult {
  const canonicalUrl = (input.canonicalUrl ?? "").trim();
  const ogImageUrl = (input.ogImageUrl ?? "").trim();
  const goUrl = (input.goUrl ?? "").trim();

  if (!canonicalUrl) return { ok: false, reason: "missing_canonical_url" };
  if (!ogImageUrl) return { ok: false, reason: "missing_og_image_url" };
  if (!goUrl) return { ok: false, reason: "missing_go_url" };

  if (!isHttpsUrl(canonicalUrl)) return { ok: false, reason: "invalid_canonical_url" };
  if (!isHttpsUrl(ogImageUrl)) return { ok: false, reason: "invalid_og_image_url" };
  if (!isHttpsUrl(goUrl)) return { ok: false, reason: "invalid_go_url" };

  return {
    ok: true,
    verification: {
      canonicalUrl,
      ogImageUrl,
      goUrl,
      ready: true,
    },
  };
}
