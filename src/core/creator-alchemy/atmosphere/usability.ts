export interface AtmosphereUsabilityCheck {
  ok: boolean;
  reasons: string[];
}

export function validateAtmosphereUsability(input: {
  navigationVisible: boolean;
  primaryActionVisible: boolean;
  textReadable: boolean;
  motionSafe: boolean;
  blocksContent: boolean;
}): AtmosphereUsabilityCheck {
  const reasons: string[] = [];

  if (!input.navigationVisible) reasons.push("navigation_hidden");
  if (!input.primaryActionVisible) reasons.push("primary_action_hidden");
  if (!input.textReadable) reasons.push("text_not_readable");
  if (!input.motionSafe) reasons.push("motion_not_safe");
  if (input.blocksContent) reasons.push("content_blocked");

  return {
    ok: reasons.length === 0,
    reasons
  };
}
