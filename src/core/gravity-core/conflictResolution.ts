export type ConflictResolutionResult = {
  conflictDetected: boolean;
  yieldedToUI: boolean;
};

export function resolveGravityConflict(conflict: boolean): ConflictResolutionResult {
  return {
    conflictDetected: conflict,
    yieldedToUI: conflict,
  };
}
