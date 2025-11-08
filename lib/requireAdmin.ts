export function requireAdminHeader(headers: Headers) {
  const token = headers.get("x-admin-token") || "";
  const expected = process.env.ADMIN_TOKEN || "dev-admin-token";
  if (!token || token !== expected) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}
