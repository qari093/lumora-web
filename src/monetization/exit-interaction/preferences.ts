export type ExitInteractionPreferences = {
  enabled: boolean;
};

export function createExitInteractionPreferences(enabled = true): ExitInteractionPreferences {
  return { enabled };
}

export function canShowExitInteraction(input: {
  preferences: ExitInteractionPreferences;
  eligible: boolean;
}) {
  return input.preferences.enabled && input.eligible;
}
