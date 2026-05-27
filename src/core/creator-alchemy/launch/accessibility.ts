export interface AccessibilityCheck {
  ok: boolean;
  ariaLabelsReady: boolean;
  reducedMotionReady: boolean;
  contrastReady: boolean;
  keyboardSafe: boolean;
}

export function validateAccessibility(input: AccessibilityCheck): AccessibilityCheck {
  return {
    ...input,
    ok: input.ariaLabelsReady && input.reducedMotionReady && input.contrastReady && input.keyboardSafe
  };
}
