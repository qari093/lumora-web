type LVL = "info" | "error";
function emit(level: LVL, msg: string, data: Record<string, any> = {}) {
  const line = { level, msg, ts: new Date().toISOString(), ...data };
  (level === "error" ? console.error : console.log)(JSON.stringify(line));
}
export function logInfo(msg: string, data?: Record<string, any>) { emit("info", msg, data); }
export function logError(msg: string, data?: Record<string, any>) { emit("error", msg, data); }
