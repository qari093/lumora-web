import type { AnchorCircle } from "./anchorCircle";

export type CreatorUpload = {
  uploadId: string;
  creatorId: string;
  createdAt: string;
  assignedCircleId?: string;
};

export function assignUploadToNextCircle(upload: CreatorUpload, circle: AnchorCircle): {
  upload: CreatorUpload;
  circle: AnchorCircle;
} {
  if (circle.assignedUploadIds.includes(upload.uploadId)) {
    return {
      upload: { ...upload, assignedCircleId: circle.circleId },
      circle,
    };
  }

  return {
    upload: {
      ...upload,
      assignedCircleId: circle.circleId,
    },
    circle: {
      ...circle,
      assignedUploadIds: [...circle.assignedUploadIds, upload.uploadId],
    },
  };
}

export function assignUploadsToNextCircle(uploads: CreatorUpload[], circle: AnchorCircle): {
  uploads: CreatorUpload[];
  circle: AnchorCircle;
} {
  let nextCircle = circle;
  const nextUploads: CreatorUpload[] = [];

  for (const upload of uploads) {
    const assigned = assignUploadToNextCircle(upload, nextCircle);
    nextUploads.push(assigned.upload);
    nextCircle = assigned.circle;
  }

  return {
    uploads: nextUploads,
    circle: nextCircle,
  };
}
