import { REQUIRED_ENV_KEYS, OPTIONAL_ENV_KEYS } from "@/config/lumoraEnv";

export type EnvValidationResult = {
  ok: boolean;
  missingRequired: string[];
  presentOptional: string[];
  ts: number;
};

export function validateEnv(): EnvValidationResult {
  const missingRequired: string[] = [];
  const presentOptional: string[] = [];

  REQUIRED_ENV_KEYS.forEach((key) => {
    if (!process.env[key]) missingRequired.push(key);
  });

  OPTIONAL_ENV_KEYS.forEach((key) => {
    if (process.env[key]) presentOptional.push(key);
  });

  return {
    ok: missingRequired.length === 0,
    missingRequired,
    presentOptional,
    ts: Date.now(),
  };
}
