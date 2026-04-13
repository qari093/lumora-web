export type SslHttpsRuntimeInput = {
  httpsEnabled?: boolean | null;
  redirectHttpToHttps?: boolean | null;
  hstsEnabled?: boolean | null;
  canonicalUrl?: string | null;
};

export type SslHttpsRuntimeResult =
  | {
      ok: true;
      runtime: {
        httpsEnabled: boolean;
        redirectHttpToHttps: boolean;
        hstsEnabled: boolean;
        canonicalUrl: string;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

function clean(v?: string | null) {
  return (v ?? "").trim();
}

export function evaluateSslHttpsRuntimeCheck(
  input: SslHttpsRuntimeInput
): SslHttpsRuntimeResult {
  const httpsEnabled = Boolean(input.httpsEnabled);
  const redirectHttpToHttps = Boolean(input.redirectHttpToHttps);
  const hstsEnabled = Boolean(input.hstsEnabled);
  const canonicalUrl = clean(input.canonicalUrl);

  if (!canonicalUrl) return { ok: false, reason: "missing_canonical_url" };

  let parsed: URL;
  try {
    parsed = new URL(canonicalUrl);
  } catch {
    return { ok: false, reason: "invalid_canonical_url" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "canonical_url_must_be_https" };
  }

  return {
    ok: true,
    runtime: {
      httpsEnabled,
      redirectHttpToHttps,
      hstsEnabled,
      canonicalUrl,
      ready: httpsEnabled && redirectHttpToHttps && hstsEnabled,
    },
  };
}
