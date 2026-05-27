import type { RuntimeDomain } from "../domainRegistry";
import type { LumoraApiFailure, LumoraApiMeta, LumoraApiResponse, RuntimeKind } from "./types";
import { createRequestId } from "./requestId";

export function createApiMeta(input: {
  domain: RuntimeDomain;
  version: string;
  runtime: RuntimeKind;
  requestId?: string;
  deprecated?: boolean;
  canonicalRoute?: string;
}): LumoraApiMeta {
  return {
    domain: input.domain,
    version: input.version,
    runtime: input.runtime,
    requestId: input.requestId ?? createRequestId(input.domain),
    ...(input.deprecated !== undefined ? { deprecated: input.deprecated } : {}),
    ...(input.canonicalRoute ? { canonicalRoute: input.canonicalRoute } : {})
  };
}

export function apiSuccess<T>(input: {
  data: T;
  domain: RuntimeDomain;
  version: string;
  runtime?: RuntimeKind;
  requestId?: string;
  deprecated?: boolean;
  canonicalRoute?: string;
}): LumoraApiResponse<T> {
  return {
    ok: true,
    data: input.data,
    meta: createApiMeta({
      domain: input.domain,
      version: input.version,
      runtime: input.runtime ?? "node",
      requestId: input.requestId,
      deprecated: input.deprecated,
      canonicalRoute: input.canonicalRoute
    })
  };
}

export function apiFailure(input: {
  code: string;
  message: string;
  domain: RuntimeDomain;
  version: string;
  runtime?: RuntimeKind;
  requestId?: string;
  deprecated?: boolean;
  canonicalRoute?: string;
}): LumoraApiFailure {
  return {
    ok: false,
    error: {
      code: sanitizeErrorCode(input.code),
      message: sanitizeSafeMessage(input.message),
      safe: true
    },
    meta: createApiMeta({
      domain: input.domain,
      version: input.version,
      runtime: input.runtime ?? "node",
      requestId: input.requestId,
      deprecated: input.deprecated,
      canonicalRoute: input.canonicalRoute
    })
  };
}

export function sanitizeErrorCode(code: string): string {
  const clean = code.trim().toLowerCase().replace(/[^a-z0-9_:-]/g, "_");
  return clean.length > 0 ? clean : "unknown_error";
}

export function sanitizeSafeMessage(message: string): string {
  const blocked = ["stack", "token", "secret", "password", "database_url", "private_key"];
  const lower = message.toLowerCase();

  if (blocked.some((term) => lower.includes(term))) {
    return "A safe runtime error occurred.";
  }

  return message.trim().slice(0, 240) || "A safe runtime error occurred.";
}
