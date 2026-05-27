export function ensureFeedContract(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj.ok === true &&
    obj.source === "native_fyp" &&
    Array.isArray(obj.items)
  );
}
