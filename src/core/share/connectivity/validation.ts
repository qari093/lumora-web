import type { ExternalBridgeAction } from "./platformTypes";

export function validateBridgeAction(action: ExternalBridgeAction) {
  const warnings: string[] = [...action.privacyWarnings];

  if (!action.payload.url.startsWith("https://") && !action.payload.url.startsWith("lumora://") && !action.action.startsWith("intent://")) {
    warnings.push("unsafe_url_scheme");
  }

  if (action.payload.title.length === 0) warnings.push("missing_title");
  if (action.payload.text.length > 500) warnings.push("text_too_long");

  return {
    ok: warnings.length === action.privacyWarnings.length,
    warnings,
  };
}
