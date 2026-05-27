import type { LumoraApiResponse } from "./types";

export function isLumoraApiResponse(value: unknown): value is LumoraApiResponse<unknown> {
  if (!value || typeof value !== "object") return false;

  const response = value as Partial<LumoraApiResponse<unknown>>;
  if (typeof response.ok !== "boolean") return false;
  if (!response.meta || typeof response.meta !== "object") return false;

  const meta = response.meta as Record<string, unknown>;
  if (typeof meta.domain !== "string") return false;
  if (typeof meta.version !== "string") return false;
  if (typeof meta.runtime !== "string") return false;
  if (typeof meta.requestId !== "string") return false;

  if (response.ok === true) {
    return "data" in response;
  }

  const failure = response as { error?: unknown };
  if (!failure.error || typeof failure.error !== "object") return false;
  const error = failure.error as Record<string, unknown>;

  return typeof error.code === "string" && typeof error.message === "string" && error.safe === true;
}

export function assertLumoraApiResponse(value: unknown): asserts value is LumoraApiResponse<unknown> {
  if (!isLumoraApiResponse(value)) {
    throw new Error("invalid_lumora_api_response");
  }
}
