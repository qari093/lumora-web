export type LumoraNativeTransformationType =
  | "trend-to-film"
  | "teaser-recap"
  | "mood-cinematic-edit"
  | "why-this-is-heating"
  | "fandom-pulse-recap";

export type LumoraNativeTransformationState =
  | "draft"
  | "ready"
  | "queued"
  | "published"
  | "blocked";

export type LumoraNativeTransformation = {
  id: string;
  type: LumoraNativeTransformationType;
  sourceRef: string;
  title: string;
  state: LumoraNativeTransformationState;
  safePromptTemplateId?: string;
  createdAt: string;
  updatedAt: string;
};

export const LUMORA_NATIVE_TRANSFORMATION_REGISTRY: LumoraNativeTransformation[] = [];

export function registerLumoraNativeTransformation(
  item: LumoraNativeTransformation
): void {
  LUMORA_NATIVE_TRANSFORMATION_REGISTRY.push(item);
}

export function getLumoraNativeTransformationById(
  id: string
): LumoraNativeTransformation | undefined {
  return LUMORA_NATIVE_TRANSFORMATION_REGISTRY.find((item) => item.id === id);
}

export function getActiveLumoraNativeTransformations(): LumoraNativeTransformation[] {
  return LUMORA_NATIVE_TRANSFORMATION_REGISTRY.filter(
    (item) => item.state === "ready" || item.state === "queued" || item.state === "published"
  );
}
