export type ArchiveMetadataItem = {
  identifier?: string;
  title?: string;
  licenseurl?: string;
  license?: string;
  mediatype?: string;
  collection?: string[];
  files?: Array<{
    name?: string;
    format?: string;
    source?: string;
    size?: string;
  }>;
};

export function buildArchiveSearchUrl(query: string, page = 1) {
  const params = new URLSearchParams({
    q: `(${query}) AND mediatype:(movies)`,
    fl: "identifier,title,licenseurl,mediatype,collection",
    rows: "50",
    page: String(page),
    output: "json",
  });

  return `https://archive.org/advancedsearch.php?${params.toString()}`;
}

export function extractArchiveVideoCandidates(item: ArchiveMetadataItem) {
  const files = item.files || [];

  return files.filter((file) => {
    const name = String(file.name || "").toLowerCase();
    const format = String(file.format || "").toLowerCase();

    return (
      name.endsWith(".mp4") ||
      format.includes("mpeg4") ||
      format.includes("h.264")
    );
  });
}

export function normalizeArchiveManifestItem(item: ArchiveMetadataItem, file: any, context: any = {}) {
  return {
    source: "archive",
    sourceId: item.identifier,
    sourceUrl: item.identifier ? `https://archive.org/details/${item.identifier}` : "",
    title: item.title || "Archive Real-Life Clip",
    query: context.query || "",
    decade: context.decade || "",
    license: item.license || item.licenseurl || "public domain",
    mp4Url: item.identifier && file?.name
      ? `https://archive.org/download/${item.identifier}/${encodeURIComponent(file.name)}`
      : "",
    archiveFile: file?.name || "",
    contentMode: "archive-real-life",
  };
}

export function mergeArchiveIntoManifest(existing: any[], additions: any[]) {
  const seen = new Set(existing.map((x) => `${x.source}:${x.sourceId}:${x.archiveFile || x.mp4Url}`));
  const out = [...existing];

  for (const item of additions) {
    const key = `${item.source}:${item.sourceId}:${item.archiveFile || item.mp4Url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}
