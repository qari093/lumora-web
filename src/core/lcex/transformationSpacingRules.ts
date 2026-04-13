export type TransformationSpacingInput = {
  recentTransformationTypes: string[];
  candidateTransformationType:
    | "trend-to-film"
    | "teaser-recap"
    | "mood-cinematic-edit"
    | "why-this-is-heating"
    | "fandom-pulse-recap";
  recentEntityIds: string[];
  candidateEntityId: string;
};

export type TransformationSpacingDecision = {
  allowed: boolean;
  reason: "ok" | "transformation_too_dense" | "entity_repeat_too_soon";
  minDistanceSatisfied: boolean;
};

const MIN_TRANSFORMATION_DISTANCE = 2;
const MIN_ENTITY_REPEAT_DISTANCE = 3;

export function resolveTransformationSpacing(
  input: TransformationSpacingInput
): TransformationSpacingDecision {
  const typeIndex = input.recentTransformationTypes.findIndex(
    (value) => value === input.candidateTransformationType
  );

  if (typeIndex !== -1 && typeIndex < MIN_TRANSFORMATION_DISTANCE) {
    return {
      allowed: false,
      reason: "transformation_too_dense",
      minDistanceSatisfied: false,
    };
  }

  const entityIndex = input.recentEntityIds.findIndex(
    (value) => value === input.candidateEntityId
  );

  if (entityIndex !== -1 && entityIndex < MIN_ENTITY_REPEAT_DISTANCE) {
    return {
      allowed: false,
      reason: "entity_repeat_too_soon",
      minDistanceSatisfied: false,
    };
  }

  return {
    allowed: true,
    reason: "ok",
    minDistanceSatisfied: true,
  };
}

export function canInsertTransformationWithSpacing(
  input: TransformationSpacingInput
): boolean {
  return resolveTransformationSpacing(input).allowed;
}
