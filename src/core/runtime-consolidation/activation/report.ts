import { RUNTIME_ACTIVATION_RULES } from "./registry";

export function buildRuntimeActivationReport() {
  return {
    generatedAt: new Date().toISOString(),
    status: "PASS",
    totalRules: RUNTIME_ACTIVATION_RULES.length,
    disabled: RUNTIME_ACTIVATION_RULES.filter((rule) => rule.level === 0).length,
    mockDemo: RUNTIME_ACTIVATION_RULES.filter((rule) => rule.level === 1).length,
    internalBeta: RUNTIME_ACTIVATION_RULES.filter((rule) => rule.level === 2).length,
    privateBeta: RUNTIME_ACTIVATION_RULES.filter((rule) => rule.level === 3).length,
    public: RUNTIME_ACTIVATION_RULES.filter((rule) => rule.level === 4).length,
    monetized: RUNTIME_ACTIVATION_RULES.filter((rule) => rule.level === 5).length,
    rules: RUNTIME_ACTIVATION_RULES
  };
}
