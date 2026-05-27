export const ARCHIVE_SOURCES = {
  internetArchive: {
    enabled: true,
    baseUrl: "https://archive.org/advancedsearch.php",
    license: "public_domain_only",
  },
  prelinger: {
    enabled: true,
    collection: "prelinger",
    safeOnly: true,
  },
};

export function isPublicDomain(item: any): boolean {
  const license = String(item.license || "").toLowerCase();
  return (
    license.includes("public domain") ||
    license.includes("cc0") ||
    license.includes("no known copyright")
  );
}

export function rejectUnknownLicense(item: any): boolean {
  return !isPublicDomain(item);
}

export function normalizeArchiveMeta(item: any) {
  return {
    id: item.identifier || item.id,
    title: item.title || "",
    source: "archive",
    license: item.license || "unknown",
    mediatype: item.mediatype || "",
  };
}
