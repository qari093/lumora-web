import type { CircleUploadCandidate } from "./eligibleUploads";

export type CircleUploadQueueItem = {
  uploadId: string;
  creatorId: string;
  videoId: string;
  targetCircleId: string;
  queuedAt: string;
};

export function queueUploadIntoNextCircle(input: {
  upload: CircleUploadCandidate;
  targetCircleId: string;
  queuedAt?: string;
}): CircleUploadQueueItem {
  return {
    uploadId: input.upload.uploadId,
    creatorId: input.upload.creatorId,
    videoId: input.upload.videoId,
    targetCircleId: input.targetCircleId,
    queuedAt: input.queuedAt || new Date().toISOString(),
  };
}

export function queueUploadsIntoNextCircle(input: {
  uploads: CircleUploadCandidate[];
  targetCircleId: string;
  queuedAt?: string;
}): CircleUploadQueueItem[] {
  return input.uploads.map((upload) =>
    queueUploadIntoNextCircle({
      upload,
      targetCircleId: input.targetCircleId,
      queuedAt: input.queuedAt,
    }),
  );
}
