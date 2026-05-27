export type UploadSession = {
  contentId: string;
  deviceId: string;
  totalBytes: number;
  chunkSizeBytes: number;
  totalChunks: number;
  receivedChunks: number[];
  status: "created" | "uploading" | "raw-ready";
};

export type UploadChunk = {
  contentId: string;
  chunkIndex: number;
  bytesReceived: number;
};

export type RawContentRegistryRecord = {
  contentId: string;
  deviceId: string;
  status: "staged";
  rawBytes: number;
  uploadProgress: number;
  createdAt: string;
};

export function createUploadSession(input: {
  contentId: string;
  deviceId: string;
  totalBytes: number;
  chunkSizeBytes?: number;
}): UploadSession {
  const chunkSizeBytes = input.chunkSizeBytes || 2 * 1024 * 1024;

  return {
    contentId: input.contentId,
    deviceId: input.deviceId,
    totalBytes: input.totalBytes,
    chunkSizeBytes,
    totalChunks: Math.ceil(input.totalBytes / chunkSizeBytes),
    receivedChunks: [],
    status: "created",
  };
}

export function acceptUploadChunk(session: UploadSession, chunk: UploadChunk): UploadSession {
  if (chunk.contentId !== session.contentId) {
    throw new Error("content_id_mismatch");
  }

  if (chunk.chunkIndex < 0 || chunk.chunkIndex >= session.totalChunks) {
    throw new Error("chunk_index_out_of_bounds");
  }

  const receivedChunks = Array.from(new Set([...session.receivedChunks, chunk.chunkIndex])).sort((a, b) => a - b);
  const complete = receivedChunks.length === session.totalChunks;

  return {
    ...session,
    receivedChunks,
    status: complete ? "raw-ready" : "uploading",
  };
}

export function getUploadProgress(session: UploadSession) {
  return {
    contentId: session.contentId,
    receivedChunks: session.receivedChunks.length,
    totalChunks: session.totalChunks,
    progress: session.totalChunks > 0 ? session.receivedChunks.length / session.totalChunks : 0,
    rawReady: session.status === "raw-ready",
  };
}

export function createRawContentRegistryRecord(input: {
  session: UploadSession;
  createdAt?: string;
}): RawContentRegistryRecord {
  const progress = getUploadProgress(input.session);

  return {
    contentId: input.session.contentId,
    deviceId: input.session.deviceId,
    status: "staged",
    rawBytes: input.session.totalBytes,
    uploadProgress: progress.progress,
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

export function validateRawContentReady(session: UploadSession) {
  const progress = getUploadProgress(session);

  return {
    ok: progress.rawReady && progress.progress === 1,
    reason: progress.rawReady ? "content_raw_ready" : "content_upload_incomplete",
  };
}
