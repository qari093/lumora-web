"use client";

import React from "react";
import { normalizeError } from "@/lib/errors/normalizeError";

type CrashBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type CrashBoundaryState = {
  hasError: boolean;
  errorMessage?: string;
};

export default class CrashBoundary extends React.Component<CrashBoundaryProps, CrashBoundaryState> {
  state: CrashBoundaryState = {
    hasError: false,
    errorMessage: undefined,
  };

  static getDerivedStateFromError(error: unknown): CrashBoundaryState {
    const normalized = normalizeError(error);
    return {
      hasError: true,
      errorMessage: normalized.message,
    };
  }

  componentDidCatch(error: unknown) {
    const normalized = normalizeError(error);
    console.error(
      JSON.stringify({
        level: "error",
        scope: "ui.crash_boundary",
        message: normalized.message,
        name: normalized.name,
        ts: normalized.ts,
      })
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              minHeight: "100dvh",
              display: "grid",
              placeItems: "center",
              padding: 24,
              background: "#05070b",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 28 }}>Lumora hit an unexpected issue</h1>
              <p style={{ marginTop: 12, opacity: 0.82 }}>
                {this.state.errorMessage ?? "Unknown crash"}
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
