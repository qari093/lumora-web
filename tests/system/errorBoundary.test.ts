import { describe, expect, it } from "vitest";
import { resolveErrorBoundaryView } from "@/lib/system/errorBoundary";

describe("error boundary + fallback UI", () => {
  it("returns ready state when there is no error", () => {
    const out = resolveErrorBoundaryView({
      hasError: false,
      message: "",
      retryable: false,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.view.state).toBe("ready");
      expect(out.view.title).toBe("Ready");
    }
  });

  it("returns fallback state with default message", () => {
    const out = resolveErrorBoundaryView({
      hasError: true,
      message: "",
      retryable: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.view.state).toBe("fallback");
      expect(out.view.message).toBe("Something went wrong. Please try again.");
      expect(out.view.retryable).toBe(true);
    }
  });

  it("uses provided message when available", () => {
    const out = resolveErrorBoundaryView({
      hasError: true,
      message: "Feed temporarily unavailable",
      retryable: false,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.view.message).toBe("Feed temporarily unavailable");
      expect(out.view.retryable).toBe(false);
    }
  });

  it("trims provided message", () => {
    const out = resolveErrorBoundaryView({
      hasError: true,
      message: "  Recoverable issue  ",
      retryable: true,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.view.message).toBe("Recoverable issue");
    }
  });
});
