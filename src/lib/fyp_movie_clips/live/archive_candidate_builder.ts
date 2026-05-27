import { buildArchiveDownloadUrl, selectArchiveMovieFiles } from "../archive_files";
import { inferMovieClipCategory, inferMovieClipMood } from "../mood_tags";
import type { ArchiveMetadataResponse } from "./archive_live_fetch";

export type LiveArchiveCandidate = {
  id: string;
  identifier: string;
  title: string;
  sourceId: "internet-archive-public-domain";
  sourceUrl: string;
  downloadUrl: string;
  fileName: string;
  license: string;
  mood: string;
  category: string;
};

export function buildLiveArchiveCandidates(metadata: ArchiveMetadataResponse): LiveArchiveCandidate[] {
  const identifier = metadata.metadata?.identifier;
  if (!identifier) return [];

  const title = String(metadata.metadata?.title || identifier);
  const license = String(metadata.metadata?.licenseurl || "public domain");
  const files = selectArchiveMovieFiles(metadata.files || []);

  return files.map((file, index) => ({
    id: `${identifier}-${index}`,
    identifier,
    title,
    sourceId: "internet-archive-public-domain",
    sourceUrl: `https://archive.org/details/${identifier}`,
    downloadUrl: buildArchiveDownloadUrl(identifier, file.name),
    fileName: file.name,
    license,
    mood: inferMovieClipMood(`${title} ${file.name}`),
    category: inferMovieClipCategory(`${title} ${file.name}`),
  }));
}
