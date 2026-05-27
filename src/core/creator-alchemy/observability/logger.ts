import type { RuntimeLog } from "./types";

const LOGS: RuntimeLog[] = [];

export function logCreatorAlchemyRuntime(input: Omit<RuntimeLog, "createdAt">): RuntimeLog {
  const log: RuntimeLog = {
    ...input,
    createdAt: new Date().toISOString()
  };

  LOGS.push(log);
  return log;
}

export function getCreatorAlchemyLogs(): RuntimeLog[] {
  return [...LOGS].slice(-100);
}
