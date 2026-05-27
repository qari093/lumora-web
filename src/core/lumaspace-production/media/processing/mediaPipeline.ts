import { createMediaAsset } from "../storage/mediaStorage";

export function runMediaPipeline() {
  return [
    createMediaAsset("image"),
    createMediaAsset("video")
  ];
}
