export type ErrorBoundaryInput = {
  hasError?: boolean | null;
  message?: string | null;
  retryable?: boolean | null;
};

export type ErrorBoundaryResult =
  | {
      ok: true;
      view: {
        state: "ready" | "fallback";
        title: string;
        message: string;
        retryable: boolean;
      };
    }
  | { ok: false; reason: string };

const DEFAULT_FALLBACK_MESSAGE = "Something went wrong. Please try again.";

export function resolveErrorBoundaryView(
  input: ErrorBoundaryInput
): ErrorBoundaryResult {
  const hasError = Boolean(input.hasError);
  const retryable = Boolean(input.retryable);
  const rawMessage = typeof input.message === "string" ? input.message.trim() : "";

  if (!hasError) {
    return {
      ok: true,
      view: {
        state: "ready",
        title: "Ready",
        message: "",
        retryable: false,
      },
    };
  }

  return {
    ok: true,
    view: {
      state: "fallback",
      title: "Temporary issue",
      message: rawMessage || DEFAULT_FALLBACK_MESSAGE,
      retryable,
    },
  };
}
