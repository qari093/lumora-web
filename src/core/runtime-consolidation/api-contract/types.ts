import type { RuntimeDomain } from "../domainRegistry";

export type RuntimeKind = "edge" | "node" | "static" | "dynamic" | "unknown";

export interface LumoraApiMeta {
  domain: RuntimeDomain;
  version: string;
  runtime: RuntimeKind;
  requestId: string;
  deprecated?: boolean;
  canonicalRoute?: string;
}

export interface LumoraApiSuccess<T> {
  ok: true;
  data: T;
  error?: never;
  meta: LumoraApiMeta;
}

export interface LumoraApiFailure {
  ok: false;
  data?: never;
  error: {
    code: string;
    message: string;
    safe: true;
  };
  meta: LumoraApiMeta;
}

export type LumoraApiResponse<T> = LumoraApiSuccess<T> | LumoraApiFailure;
