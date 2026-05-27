export type UploadCandidate = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationSec: number;
  width: number;
  height: number;
  codec: string;
  hasAudio: boolean;
};

export type DeviceUploadProfile = {
  deviceId: string;
  failedAttempts: number;
  uploadsToday: number;
  holdRate: number;
  skipRate: number;
};

export function validateUploadCandidate(file: UploadCandidate) {
  const errors: string[] = [];

  if (!file.mimeType.startsWith("video/")) errors.push("invalid_mime");
  if (!["h264", "avc1"].includes(file.codec.toLowerCase())) errors.push("unsupported_codec");
  if (!file.hasAudio) errors.push("audio_required");
  if (file.durationSec < 5 || file.durationSec > 90) errors.push("duration_out_of_bounds");
  if (file.width < 480 || file.height < 480) errors.push("resolution_too_low");
  if (file.width > 1920 || file.height > 1080) errors.push("resolution_too_high");
  if (file.sizeBytes > 200 * 1024 * 1024) errors.push("file_too_large");

  return {
    ok: errors.length === 0,
    errors,
    idealDuration: file.durationSec >= 10 && file.durationSec <= 45,
  };
}

export function requiresProofOfWork(profile: DeviceUploadProfile) {
  return profile.failedAttempts >= 3 || profile.uploadsToday >= 5;
}

export function calculateUploadBond(profile: DeviceUploadProfile) {
  const trusted = profile.holdRate > 0.4 && profile.skipRate < 0.3;
  const baseLimit = 3;
  const earnedBonus = trusted ? 7 : 0;

  return {
    deviceId: profile.deviceId,
    dailyLimit: baseLimit + earnedBonus,
    trusted,
    uploadsRemaining: Math.max(0, baseLimit + earnedBonus - profile.uploadsToday),
  };
}

export function canAcceptUpload(profile: DeviceUploadProfile) {
  const bond = calculateUploadBond(profile);
  return {
    ok: bond.uploadsRemaining > 0,
    bond,
    requiresProofOfWork: requiresProofOfWork(profile),
  };
}

export function createIngestionStartPayload(input: {
  contentId: string;
  deviceId: string;
  file: UploadCandidate;
}) {
  return {
    contentId: input.contentId,
    deviceId: input.deviceId,
    fileSize: input.file.sizeBytes,
    durationSec: input.file.durationSec,
    hasAudio: input.file.hasAudio,
    status: "client-validated",
  };
}
