import { NextResponse } from 'next/server';

export type JsonInit = ResponseInit & {
  status?: number;
};

function buildResponse<T>(data: T, init: JsonInit = {}) {
  return NextResponse.json(data, {
    status: init.status ?? 200,
    headers: {
      'cache-control': 'no-store',
      ...(init.headers ?? {}),
    },
  });
}

export function guardedJson<T>(route: string, data: T, init?: JsonInit): NextResponse;
export function guardedJson<T>(data: T, init?: JsonInit): NextResponse;
export function guardedJson<T>(
  routeOrData: string | T,
  dataOrInit: T | JsonInit = {} as T,
  maybeInit: JsonInit = {},
): NextResponse {
  if (
    typeof routeOrData === 'string' &&
    dataOrInit !== null &&
    typeof dataOrInit === 'object' &&
    Array.isArray(dataOrInit) === false
  ) {
    return buildResponse(dataOrInit as T, maybeInit);
  }

  return buildResponse(routeOrData as T, (dataOrInit ?? {}) as JsonInit);
}

export function guardedError(message = 'internal_error', status = 500, route = 'api.error') {
  return guardedJson(route, { ok: false, error: message }, { status });
}

export default guardedJson;
