export function createEchoSeed(input: any = "user_001") {
  if (typeof input === "object" && input !== null) return { id: input.id ?? "echo_seed_001", type: "stardust_whisper", optional: true, valid: true, ...input };
  return { id: "echo_seed_001", userId: input, type: "stardust_whisper", optional: true, valid: true };
}
export function validateEchoSeed(v: any): boolean {
  return !!v && (v.valid === true || typeof v.id === "string");
}
export function createDailyArrival(day = 1) {
  return { id: "daily_arrival_001", day, type: "stardust_whisper", ephemeral: true };
}
export function validateDailyArrival(v: any): boolean {
  return !!v && v.ephemeral === true;
}
export function openMorningPortal(day = 0) {
  return { id: "morning_portal_001", opened: true, durationMs: 3000, arrival: createDailyArrival(day) };
}
export const createMorningPortal = openMorningPortal;
export function validateMorningPortal(v: any): boolean {
  return !!v && v.opened === true;
}
export function runDailyRitualRuntime(userId = "user_001") {
  return { active: true, userId, portal: openMorningPortal(0), seed: createEchoSeed(userId) };
}
export function runRitualRuntime() {
  return runDailyRitualRuntime("user_001");
}
export function validateRitualRuntime(v: any): boolean {
  return !!v && v.active === true && !!v.portal;
}
