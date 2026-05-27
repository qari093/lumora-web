export function attachLicenseMetadata(item: any) {
  return {
    ...item,
    license: item.license || "public domain",
    licenseSource: item.licenseSource || item.sourceUrl || "",
    rightsCheckedAt: item.rightsCheckedAt || new Date(0).toISOString(),
  };
}

export function buildArchiveAuditEntry(item: any) {
  return {
    source: item.source || "archive",
    sourceId: item.sourceId || item.identifier || "",
    sourceUrl: item.sourceUrl || "",
    license: item.license || "unknown",
    archivedAt: item.downloadedAt || item.createdAt || "",
  };
}

export function buildInternalAttribution(item: any) {
  return {
    title: item.title || "Archive clip",
    source: item.source || "archive",
    sourceUrl: item.sourceUrl || "",
    license: item.license || "public domain",
  };
}

export function isArchiveBlacklisted(item: any, blacklist: string[] = []) {
  const keys = [
    item.sourceId,
    item.identifier,
    item.sourceUrl,
    item.mp4Url,
    item.archiveFile,
  ].filter(Boolean);

  return keys.some((key) => blacklist.includes(String(key)));
}

export function enforceComplianceRules(item: any, blacklist: string[] = []) {
  if (isArchiveBlacklisted(item, blacklist)) {
    return { ok: false, reason: "blacklisted" };
  }

  if (!item.license || String(item.license).toLowerCase().includes("unknown")) {
    return { ok: false, reason: "missing_or_unknown_license" };
  }

  if (!item.sourceUrl) {
    return { ok: false, reason: "missing_source_url" };
  }

  return { ok: true, reason: "compliant" };
}
