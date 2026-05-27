import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NativeFypStorageAdapter, NativeFypStorageObject } from "./types";

export function createLocalNativeFypStorage(rootDir = "public/native-fyp"): NativeFypStorageAdapter {
  return {
    async putObject(input): Promise<NativeFypStorageObject> {
      const target = path.join(process.cwd(), rootDir, input.key);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, input.body);

      return {
        key: input.key,
        contentType: input.contentType,
        sizeBytes:
          typeof input.body === "string"
            ? Buffer.byteLength(input.body)
            : input.body.byteLength,
        publicUrl: this.getPublicUrl(input.key),
      };
    },

    getPublicUrl(key: string): string {
      return `/native-fyp/${key}`;
    },

    async healthCheck() {
      return { ok: true, provider: "local" };
    },
  };
}
