export type CircleUploadCandidate = {
  uploadId: string;
  creatorId: string;
  videoId: string;
  createdAt: string;
  playable: boolean;
  alreadyAssigned?: boolean;
};

export function isUploadEligibleForCircle(upload: CircleUploadCandidate): boolean {
  return upload.playable === true && upload.alreadyAssigned !== true;
}

export function filterEligibleCircleUploads(uploads: CircleUploadCandidate[]): CircleUploadCandidate[] {
  return uploads.filter(isUploadEligibleForCircle);
}
