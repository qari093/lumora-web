export type NormalizedError = {
  name: string;
  message: string;
  stack?: string;
  ts: number;
};

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof Error) {
    return {
      name: error.name || "Error",
      message: error.message || "Unknown error",
      stack: error.stack,
      ts: Date.now(),
    };
  }

  return {
    name: "UnknownError",
    message: typeof error === "string" ? error : "Unknown error",
    ts: Date.now(),
  };
}
