
export function createLensFrame(input: any = {}) {
  return { id: "frame_001", active: true, aura: "dreamlight", ...(typeof input === "object" ? input : {}) };
}
export function validateLensFrame(v: any) { return !!v && typeof v.id === "string"; }
export function createRawLens(input: any = {}) {
  return { id: "raw_lens_001", enabled: true, active: true, source: "camera", ...(typeof input === "object" ? input : {}) };
}
export function validateRawLens(v: any) { return !!v && typeof v.id === "string" && v.enabled === true; }
export function createTwinSpark(leftId: any = "user_001", rightId: any = "user_002") {
  return { id: "twin_spark_001", leftId: typeof leftId === "string" ? leftId : "user_001", rightId, active: true };
}
export function validateTwinSpark(v: any) { return !!v && typeof v.id === "string" && typeof v.leftId === "string"; }
export function runLumaLensRuntime() {
  return { active: true, frame: createLensFrame(), rawLens: createRawLens(), twinSpark: createTwinSpark() };
}
export function validateLumaLensRuntime(v: any) { return !!v && v.active === true; }

