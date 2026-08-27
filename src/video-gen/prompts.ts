import type { GenPlan, GenRequest } from "./types";

export function makeFusion(req: GenRequest): GenPlan {
  const prompt = String(req.prompt || "").trim();
  const categories = Array.isArray(req.categories) ? req.categories : [];
  const normalized = `${prompt} ${categories.join(" ")}`.toLowerCase();

  const primary =
    /asmr|satisfying|relax/.test(normalized)
      ? "asmr_satisfying"
      : /transform|before|after|makeover/.test(normalized)
        ? "transformations"
        : /visual|spectacle|cinematic|wow/.test(normalized)
          ? "visual_spectacle"
          : "general";

  const hook = prompt.length > 0 ? prompt.slice(0, 120) : "Watch what happens next";

  const hashtags = Array.from(
    new Set([
      "lumora",
      "discover",
      ...categories
        .map((value) => String(value).toLowerCase().replace(/[^a-z0-9_-]/g, ""))
        .filter(Boolean),
    ]),
  ).slice(0, 8);

  return {
    primary,
    hook,
    cta: "Save & share",
    hashtags,
  };
}

export function scriptPrompt(plan: GenPlan, prompt: string, language: string): string {
  return [
    `Language: ${language}`,
    `Format: ${plan.primary}`,
    `Hook: ${plan.hook}`,
    `Prompt: ${prompt}`,
  ].join("\n");
}

export function _brollPrompt(plan: GenPlan): string {
  return `Create supporting B-roll for ${plan.primary}`;
}
