import type {
  ChroniclePage
} from "../types";

export function createChroniclePages(): ChroniclePage[] {
  return [
    {
      id: "page_001",
      title: "Soft Morning",
      atmosphere: "dream"
    },
    {
      id: "page_002",
      title: "Golden Drift",
      atmosphere: "wonder"
    }
  ];
}
