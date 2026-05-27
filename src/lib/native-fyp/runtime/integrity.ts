export function verifyIntegrity(obj: any): boolean {
  return Boolean(
    obj &&
    obj.nativeFyp === true &&
    obj.status === "production_ready" &&
    obj.version
  );
}
