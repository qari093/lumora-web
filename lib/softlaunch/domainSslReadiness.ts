export type DomainSslInput = {
  domain?: string | null;
  dnsConfigured?: boolean | null;
  sslIssued?: boolean | null;
  canonicalHost?: string | null;
};

export type DomainSslResult =
  | {
      ok: true;
      readiness: {
        domain: string;
        dnsConfigured: boolean;
        sslIssued: boolean;
        canonicalHost: string;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

function clean(value?: string | null) {
  return (value ?? "").trim();
}

export function evaluateDomainSslReadiness(input: DomainSslInput): DomainSslResult {
  const domain = clean(input.domain).toLowerCase();
  const canonicalHost = clean(input.canonicalHost).toLowerCase();
  const dnsConfigured = Boolean(input.dnsConfigured);
  const sslIssued = Boolean(input.sslIssued);

  if (!domain) return { ok: false, reason: "missing_domain" };
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return { ok: false, reason: "invalid_domain" };

  if (!canonicalHost) return { ok: false, reason: "missing_canonical_host" };
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(canonicalHost)) {
    return { ok: false, reason: "invalid_canonical_host" };
  }

  return {
    ok: true,
    readiness: {
      domain,
      dnsConfigured,
      sslIssued,
      canonicalHost,
      ready: dnsConfigured && sslIssued,
    },
  };
}
