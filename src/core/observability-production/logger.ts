export function logRuntimeEvent(input: {
  level: "info" | "warn" | "error";
  message: string;
}) {
  return {
    ...input,
    ts: new Date().toISOString(),
  };
}
