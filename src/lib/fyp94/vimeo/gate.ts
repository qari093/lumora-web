export type Fyp94VimeoCandidate = {
  id?: string;
  name?: string;
  uri?: string;
  link?: string;
  license?: string;
  download?: Array<{
    link?: string;
    type?: string;
    width?: number;
    height?: number;
  }>;
};

export function isFyp94AllowedVimeoLicense(license?: string): boolean {
  return license === "cc-by";
}

export function getFyp94VimeoDirectMp4(candidate: Fyp94VimeoCandidate): string | null {
  const files = candidate.download ?? [];

  const mp4 = files.find((file) => {
    const type = (file.type || "").toLowerCase();
    const link = file.link || "";
    return type.includes("mp4") || link.endsWith(".mp4") || link.includes(".mp4?");
  });

  return mp4?.link ?? null;
}

export function validateFyp94VimeoCandidate(candidate: Fyp94VimeoCandidate) {
  const licenseOk = isFyp94AllowedVimeoLicense(candidate.license);
  const mp4Url = getFyp94VimeoDirectMp4(candidate);

  return {
    ok: Boolean(candidate.id && licenseOk && mp4Url),
    reason: !candidate.id
      ? "missing_id"
      : !licenseOk
        ? "license_not_cc_by"
        : !mp4Url
          ? "missing_direct_mp4"
          : null,
    mp4Url,
  };
}

export function normalizeFyp94VimeoCandidate(candidate: Fyp94VimeoCandidate) {
  const validation = validateFyp94VimeoCandidate(candidate);

  if (!validation.ok || !validation.mp4Url) {
    throw new Error(validation.reason || "invalid_vimeo_candidate");
  }

  return {
    source: "vimeo",
    sourceId: candidate.id,
    sourceUrl: candidate.link || candidate.uri || "",
    title: candidate.name || "Vimeo CC Clip",
    query: "vimeo cc",
    mp4Url: validation.mp4Url,
    license: "cc-by",
  };
}
