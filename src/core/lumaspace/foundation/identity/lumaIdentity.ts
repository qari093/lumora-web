export type LumaIdentity = {
  id: string;
  mode: "solo";
};

export function createIdentity(id = "user_001"): LumaIdentity {
  return {
    id,
    mode: "solo"
  };
}

export function createLumaIdentity(id = "user_001"): LumaIdentity {
  return createIdentity(id);
}

export function validateIdentity(input: unknown): input is LumaIdentity {
  const value = input as Partial<LumaIdentity>;
  return Boolean(value && typeof value.id === "string" && value.mode === "solo");
}
