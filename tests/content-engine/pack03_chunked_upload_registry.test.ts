import { describe, expect, it } from "vitest";
import {
  acceptUploadChunk,
  createRawContentRegistryRecord,
  createUploadSession,
  getUploadProgress,
  validateRawContentReady,
} from "@/src/content-engine/upload";

describe("Content Engine Pack03 — Chunked Upload + Raw Content Registry", () => {
  it("creates 2MB chunked upload session", () => {
    const session = createUploadSession({
      contentId: "content1",
      deviceId: "device1",
      totalBytes: 5 * 1024 * 1024,
    });

    expect(session.chunkSizeBytes).toBe(2 * 1024 * 1024);
    expect(session.totalChunks).toBe(3);
    expect(session.status).toBe("created");
  });

  it("accepts chunks and tracks progress", () => {
    let session = createUploadSession({
      contentId: "content1",
      deviceId: "device1",
      totalBytes: 4 * 1024 * 1024,
    });

    session = acceptUploadChunk(session, {
      contentId: "content1",
      chunkIndex: 0,
      bytesReceived: 2 * 1024 * 1024,
    });

    expect(session.status).toBe("uploading");
    expect(getUploadProgress(session).progress).toBe(0.5);

    session = acceptUploadChunk(session, {
      contentId: "content1",
      chunkIndex: 1,
      bytesReceived: 2 * 1024 * 1024,
    });

    expect(session.status).toBe("raw-ready");
    expect(getUploadProgress(session).progress).toBe(1);
  });

  it("deduplicates repeated chunk indices", () => {
    let session = createUploadSession({
      contentId: "content1",
      deviceId: "device1",
      totalBytes: 4 * 1024 * 1024,
    });

    session = acceptUploadChunk(session, { contentId: "content1", chunkIndex: 0, bytesReceived: 1 });
    session = acceptUploadChunk(session, { contentId: "content1", chunkIndex: 0, bytesReceived: 1 });

    expect(session.receivedChunks).toHaveLength(1);
  });

  it("creates staged raw content registry record", () => {
    let session = createUploadSession({
      contentId: "content1",
      deviceId: "device1",
      totalBytes: 2 * 1024 * 1024,
    });

    session = acceptUploadChunk(session, {
      contentId: "content1",
      chunkIndex: 0,
      bytesReceived: 2 * 1024 * 1024,
    });

    const record = createRawContentRegistryRecord({
      session,
      createdAt: "2026-05-04T00:00:00.000Z",
    });

    expect(record.status).toBe("staged");
    expect(record.uploadProgress).toBe(1);
    expect(record.createdAt).toBe("2026-05-04T00:00:00.000Z");
  });

  it("validates raw content readiness", () => {
    let session = createUploadSession({
      contentId: "content1",
      deviceId: "device1",
      totalBytes: 2 * 1024 * 1024,
    });

    expect(validateRawContentReady(session).ok).toBe(false);

    session = acceptUploadChunk(session, {
      contentId: "content1",
      chunkIndex: 0,
      bytesReceived: 2 * 1024 * 1024,
    });

    expect(validateRawContentReady(session).ok).toBe(true);
  });
});
