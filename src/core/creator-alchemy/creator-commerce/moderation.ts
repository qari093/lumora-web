const BLOCKED = [
  "guaranteed viral",
  "buy followers",
  "gambling",
  "casino",
  "adult explicit",
  "fake brand"
];

export function validateCreatorCommerceCopy(copy: string): boolean {
  const lower = copy.toLowerCase();
  return !BLOCKED.some((term) => lower.includes(term));
}
