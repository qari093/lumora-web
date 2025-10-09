export type UserRec = {
  id: string;
  email: string;
  passwordHash?: string;
  deviceIds?: string[];
  twoFASecret?: string;       // TOTP secret (store encrypted in prod)
  backupCodesHash?: string[]; // sha256 hashes
  webauthn?: {                 // simplest single-cred demo
    credId: Buffer;
    publicKey: Buffer;
    counter: number;
  } | null;
};
type DB = { usersById: Record<string,UserRec>; usersByEmail: Record<string,string> };
const g = globalThis as any;
export const demoDB: DB = g.__lumoraDemoDB || (g.__lumoraDemoDB = { usersById:{}, usersByEmail:{} });

export function getByEmail(email:string){ const id = demoDB.usersByEmail[email]; return id? demoDB.usersById[id] : null; }
export function put(u:UserRec){ demoDB.usersById[u.id]=u; demoDB.usersByEmail[u.email]=u.id; return u; }
export function getById(id:string){ return demoDB.usersById[id]||null; }
