export function validateCircleAssignment(input: {
  uploadId?: string;
  creatorId?: string;
  videoId?: string;
  targetCircleId?: string;
}) {
  const ok = Boolean(input.uploadId && input.creatorId && input.videoId && input.targetCircleId);

  return {
    ok,
    reason: ok ? "assignment_valid" : "assignment_missing_required_fields",
  };
}
