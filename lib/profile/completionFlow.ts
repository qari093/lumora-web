export type UserProfile = {
  id: string;
  handle?: string;
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string;
  interests?: string[];
  country?: string;
};

export type CompletionResult = {
  percent: number;
  completedFields: string[];
  missingFields: string[];
  isComplete: boolean;
};

const REQUIRED_FIELDS = [
  "handle",
  "displayName",
  "avatarUrl",
  "bio",
  "interests"
] as const;

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

export function evaluateProfileCompletion(profile: UserProfile): CompletionResult {
  const completedFields: string[] = [];
  const missingFields: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (hasValue(profile[field])) completedFields.push(field);
    else missingFields.push(field);
  }

  const percent = Math.round((completedFields.length / REQUIRED_FIELDS.length) * 100);

  return {
    percent,
    completedFields,
    missingFields,
    isComplete: missingFields.length === 0
  };
}
