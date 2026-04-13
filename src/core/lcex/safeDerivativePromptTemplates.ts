export type SafeDerivativePromptTemplateType =
  | "trend-to-film"
  | "teaser-recap"
  | "mood-cinematic-edit"
  | "why-this-is-heating"
  | "fandom-pulse-recap";

export type SafeDerivativePromptTemplate = {
  id: string;
  type: SafeDerivativePromptTemplateType;
  title: string;
  systemInstruction: string;
  safetyNotes: string[];
  active: boolean;
};

export const SAFE_DERIVATIVE_PROMPT_TEMPLATES: SafeDerivativePromptTemplate[] = [
  {
    id: "trend-to-film-v1",
    type: "trend-to-film",
    title: "Trend to Film",
    systemInstruction:
      "Create a concise, original cinematic interpretation of momentum signals without reproducing copyrighted script, dialogue, or proprietary scene details.",
    safetyNotes: [
      "Do not quote source media.",
      "Do not recreate scenes beat-for-beat.",
      "Keep output derivative-safe and summary-led.",
    ],
    active: true,
  },
  {
    id: "teaser-recap-v1",
    type: "teaser-recap",
    title: "Teaser Recap",
    systemInstruction:
      "Summarize teaser momentum in original wording using high-level observations only.",
    safetyNotes: [
      "No direct transcript reconstruction.",
      "No shot-by-shot duplication.",
      "Stay abstracted and editorial.",
    ],
    active: true,
  },
  {
    id: "mood-cinematic-edit-v1",
    type: "mood-cinematic-edit",
    title: "Mood Cinematic Edit",
    systemInstruction:
      "Describe a mood-first reinterpretation using original language and generalized aesthetic direction.",
    safetyNotes: [
      "Do not imitate proprietary dialogue.",
      "Do not reproduce exact lyrics or screenplay.",
      "Keep focus on mood and tone.",
    ],
    active: true,
  },
  {
    id: "why-this-is-heating-v1",
    type: "why-this-is-heating",
    title: "Why This Is Heating",
    systemInstruction:
      "Explain momentum in short editorial form using trend signals and safe paraphrase.",
    safetyNotes: [
      "No verbatim quoting from protected material.",
      "No rumor framing as fact.",
      "Cite signals, not scripts.",
    ],
    active: true,
  },
  {
    id: "fandom-pulse-recap-v1",
    type: "fandom-pulse-recap",
    title: "Fandom Pulse Recap",
    systemInstruction:
      "Summarize fandom energy using aggregate behavior and safe original commentary.",
    safetyNotes: [
      "Avoid targeted harassment language.",
      "Avoid copyrighted fan-post reproduction.",
      "Keep output aggregate and non-identifying.",
    ],
    active: true,
  },
];

export function getSafeDerivativePromptTemplate(
  type: SafeDerivativePromptTemplateType
): SafeDerivativePromptTemplate | undefined {
  return SAFE_DERIVATIVE_PROMPT_TEMPLATES.find(
    (template) => template.type === type && template.active
  );
}

export function listActiveSafeDerivativePromptTemplates(): SafeDerivativePromptTemplate[] {
  return SAFE_DERIVATIVE_PROMPT_TEMPLATES.filter((template) => template.active);
}
