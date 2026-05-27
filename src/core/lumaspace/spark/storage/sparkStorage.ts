import type {
  SparkStorageRecord
} from "../types";

import {
  validateSparkStorageRecord
} from "../contracts/sparkContract";

export function createSparkStorageRecord(
  sparkId: string
): SparkStorageRecord {
  const record: SparkStorageRecord = {
    sparkId,
    uri: `/lumaspace/sparks/${sparkId}.mp4`,
    checksum: `checksum_${sparkId}`,
    bytes: 1024
  };

  if (!validateSparkStorageRecord(record)) {
    throw new Error("invalid_storage_record");
  }

  return record;
}
