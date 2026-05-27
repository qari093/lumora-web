export function getCreatorEngagementTools(input: {
  eligible: boolean;
  zenScore: number;
}) {
  if (!input.eligible) return [];

  const tools = ["insight_panel", "basic_boost"];

  if (input.zenScore >= 0.6) tools.push("audience_resonance_map");
  if (input.zenScore >= 0.8) tools.push("priority_growth_hint");

  return tools;
}
