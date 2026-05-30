export const isObject = (v: any) => !!v && typeof v === "object";

export function validateId(v: any): boolean {
  return isObject(v) && typeof v.id === "string" && v.id.length > 0;
}

export function validateConstellation(v: any): boolean {
  return validateId(v) && (
    Array.isArray(v.members) ||
    typeof v.members === "number" ||
    v.members === undefined
  );
}

export function validateMember(v: any): boolean {
  return validateId(v) || typeof v === "string";
}

export function createAuraBloom(input: any = {}) {
  return { id: "aura_bloom_001", active: true, aura: "dreamlight", intensity: 0.8, ...input };
}

export function validateAuraBloom(v: any): boolean {
  return validateId(v) && v.active === true;
}

export function validateSafetyBoundary(v: any): boolean {
  return validateId(v);
}

export function validateConsentLayer(v: any): boolean {
  return validateId(v);
}

export function validateRawLens(v: any): boolean {
  return validateId(v);
}

export function validateTwinSpark(v: any): boolean {
  return validateId(v) || (
    isObject(v) &&
    typeof v.leftId === "string" &&
    typeof v.rightId === "string"
  );
}

export function validateRealtimePresence(v: any): boolean {
  return validateId(v);
}

export function validatePresenceState(v: any): boolean {
  return validateId(v);
}

export function validateRealtimeRuntime(v: any): boolean {
  return isObject(v) && v.active === true;
}

export function validatePerformanceRuntime(v: any): boolean {
  return isObject(v) && v.active === true;
}

export function validateSanctuaryRuntime(v: any): boolean {
  return isObject(v) && v.active === true;
}
