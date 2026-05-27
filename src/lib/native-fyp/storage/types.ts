export type NativeFypStorageObject = {
  key: string;
  contentType: string;
  sizeBytes: number;
  publicUrl?: string;
};

export type NativeFypStorageAdapter = {
  putObject(input: {
    key: string;
    body: Buffer | Uint8Array | string;
    contentType: string;
  }): Promise<NativeFypStorageObject>;

  getPublicUrl(key: string): string;

  healthCheck(): Promise<{ ok: boolean; provider: string }>;
};
