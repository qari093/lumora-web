import type {
  LumaSpark
} from "../types";

export interface SparkStitch {
  id: string;
  leftSparkId: string;
  rightSparkId: string;
  exportable: boolean;
}

export function createSparkStitch(
  left: LumaSpark,
  right: LumaSpark
): SparkStitch {
  if (left.id === right.id) {
    throw new Error("duplicate_spark_stitch");
  }

  return {
    id: `stitch_${left.id}_${right.id}`,
    leftSparkId: left.id,
    rightSparkId: right.id,
    exportable: true
  };
}
