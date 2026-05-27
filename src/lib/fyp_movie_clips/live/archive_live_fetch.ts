import { ARCHIVE_MOVIE_QUERIES, buildArchiveAdvancedSearchUrl, buildArchiveMetadataUrl } from "../archive_search";

export type ArchiveSearchDoc = {
  identifier: string;
  title?: string;
  year?: string | number;
  licenseurl?: string;
  description?: string;
};

export type ArchiveMetadataFile = {
  name: string;
  format?: string;
  size?: string;
  length?: string;
};

export type ArchiveMetadataResponse = {
  metadata?: {
    identifier?: string;
    title?: string;
    licenseurl?: string;
    year?: string | number;
  };
  files?: ArchiveMetadataFile[];
};

export async function fetchArchiveSearchPage(fetcher: typeof fetch, page = 1): Promise<ArchiveSearchDoc[]> {
  const queries = ARCHIVE_MOVIE_QUERIES.slice(0, 2);
  const docs: ArchiveSearchDoc[] = [];

  for (const query of queries) {
    const res = await fetcher(buildArchiveAdvancedSearchUrl(query, page));
    if (!res.ok) continue;

    const json = await res.json();
    const pageDocs = Array.isArray(json?.response?.docs) ? json.response.docs : [];
    docs.push(...pageDocs);
  }

  return docs;
}

export async function fetchArchiveMetadata(fetcher: typeof fetch, identifier: string): Promise<ArchiveMetadataResponse | null> {
  const res = await fetcher(buildArchiveMetadataUrl(identifier));
  if (!res.ok) return null;
  return await res.json();
}
