export const ARCHIVE_SAFETY_RULES = {
  preferredMaxYear: 1980,
  modernPrivateCutoffYear: 2000,
  blockedTerms: [
    "explicit",
    "medical",
    "surgery",
    "graphic",
    "weapon",
    "violence",
    "crime scene",
    "accident injury",
  ],
};

export function extractArchiveYear(item: any): number | null {
  const text = `${item.year || ""} ${item.date || ""} ${item.title || ""}`.toLowerCase();
  const match = text.match(/\b(19[0-9]{2}|20[0-2][0-9])\b/);
  return match ? Number(match[1]) : null;
}

export function isPreferredArchiveEra(item: any): boolean {
  const year = extractArchiveYear(item);
  return year === null || year <= ARCHIVE_SAFETY_RULES.preferredMaxYear;
}

export function rejectModernPrivateIndividualRisk(item: any): boolean {
  const year = extractArchiveYear(item);
  const setting = String(item.setting || item.subject || "").toLowerCase();

  if (year !== null && year >= ARCHIVE_SAFETY_RULES.modernPrivateCutoffYear) {
    return !setting.includes("public") && !setting.includes("news") && !setting.includes("event");
  }

  return false;
}

export function rejectUnsafeArchiveCategory(item: any): boolean {
  const text = `${item.title || ""} ${item.description || ""} ${item.subject || ""}`.toLowerCase();
  return ARCHIVE_SAFETY_RULES.blockedTerms.some((term) => text.includes(term));
}

export function enforcePublicSettingRule(item: any): boolean {
  const text = `${item.title || ""} ${item.description || ""} ${item.subject || ""} ${item.setting || ""}`.toLowerCase();

  if (text.includes("home movie") || text.includes("family")) {
    return isPreferredArchiveEra(item);
  }

  return (
    text.includes("public") ||
    text.includes("street") ||
    text.includes("event") ||
    text.includes("news") ||
    text.includes("crowd") ||
    isPreferredArchiveEra(item)
  );
}

export function classifyArchiveSafety(item: any) {
  const rejected =
    rejectModernPrivateIndividualRisk(item) ||
    rejectUnsafeArchiveCategory(item) ||
    !enforcePublicSettingRule(item);

  return {
    safe: !rejected,
    preferredEra: isPreferredArchiveEra(item),
    year: extractArchiveYear(item),
    reason: rejectModernPrivateIndividualRisk(item)
      ? "modern_private_risk"
      : rejectUnsafeArchiveCategory(item)
        ? "unsafe_category"
        : !enforcePublicSettingRule(item)
          ? "not_public_or_historical"
          : "safe",
  };
}
