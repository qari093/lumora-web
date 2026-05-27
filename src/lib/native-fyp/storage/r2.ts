import type { NativeFypStorageAdapter, NativeFypStorageObject } from "./types";

export function createR2LikeNativeFypStorage(config: {
  publicBaseUrl: string;
}): NativeFypStorageAdapter {
  return {
    async putObject(input): Promise<NativeFypStorageObject> {
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
      return `${config.publicBaseUrl.replace(/\/$/, "")}/${key}`;
    },

    async healthCheck() {
      return { ok: true, provider: "r2-like" };
    },
  };
}
