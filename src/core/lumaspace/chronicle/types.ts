export interface ChroniclePage {
  id: string;
  title: string;
  atmosphere: string;
}

export interface LifeChapter {
  id: string;
  transition: string;
}

export interface ChronicleRuntimeState {
  active: boolean;
  pages: ChroniclePage[];
}
