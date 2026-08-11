import { describe, expect, it } from 'vitest';

import { detectRouteMethodsFromSource } from '../../scripts/security/detectRouteMethods.mjs';

describe('route method export detection', () => {
  it('detects direct exported route functions', () => {
    expect(
      detectRouteMethodsFromSource(`
        export async function GET() {}
        export function POST() {}
      `),
    ).toEqual(['GET', 'POST']);
  });

  it('detects exported const route handlers', () => {
    expect(
      detectRouteMethodsFromSource(`
        export const PATCH = async () => {};
        export const DELETE = () => {};
      `),
    ).toEqual(['PATCH', 'DELETE']);
  });

  it('detects aliased NextAuth route handlers', () => {
    expect(
      detectRouteMethodsFromSource(`
        const handler = NextAuth(authOptions);
        export { handler as GET, handler as POST };
      `),
    ).toEqual(['GET', 'POST']);
  });

  it('detects named route re-exports', () => {
    expect(detectRouteMethodsFromSource("export { POST } from '../debit/route';")).toEqual([
      'POST',
    ]);
  });

  it('does not infer unrelated uppercase identifiers', () => {
    expect(
      detectRouteMethodsFromSource(`
        const GET_REQUEST = true;
        const method = "POST";
        export const runtime = "nodejs";
      `),
    ).toEqual([]);
  });
});
