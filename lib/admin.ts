export function isAdmin(headers: Headers){
  const token = process.env.ADMIN_TOKEN || "dev-admin-123";
  const h = headers.get("x-admin-token") || headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  return h === token;
}
