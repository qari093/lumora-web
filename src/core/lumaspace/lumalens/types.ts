export interface LensFrame {
  id: string;
  aura: string;
}

export interface TwinSpark {
  id: string;
  linked: boolean;
}

export interface LumaLensRuntime {
  active: boolean;
  lensId: string;
}
