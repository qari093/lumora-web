export type ArchiveFile = {
  name: string;
  format?: string;
  size?: string;
  length?: string;
  source?: string;
};

export function isMovieMp4File(file: ArchiveFile): boolean {
  const name = String(file.name || "").toLowerCase();
  const format = String(file.format || "").toLowerCase();

  return name.endsWith(".mp4") || format.includes("mpeg4") || format.includes("h.264");
}

export function rejectLikelySilentFile(file: ArchiveFile): boolean {
  const name = String(file.name || "").toLowerCase();
  return name.includes("silent") || name.includes("noaudio") || name.includes("no_audio");
}

export function selectArchiveMovieFiles(files: ArchiveFile[]): ArchiveFile[] {
  return files
    .filter(isMovieMp4File)
    .filter((file) => !rejectLikelySilentFile(file))
    .filter((file) => Number(file.size || 0) > 100_000)
    .sort((a, b) => {
      const an = String(a.name || "").toLowerCase();
      const bn = String(b.name || "").toLowerCase();
      const aSmall = an.includes("_512kb") ? -1 : 0;
      const bSmall = bn.includes("_512kb") ? -1 : 0;
      if (aSmall !== bSmall) return aSmall - bSmall;
      return Number(a.size || 0) - Number(b.size || 0);
    })
    .slice(0, 5);
}

export function buildArchiveDownloadUrl(identifier: string, fileName: string): string {
  return `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(fileName)}`;
}
