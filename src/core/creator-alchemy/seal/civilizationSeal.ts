import { validateRuleCoverage, validateEmotionalDensity, validateCreatorAgency, DEFAULT_CREATOR_AGENCY } from "../foundation";
import { buildBreathingDashboard, SAMPLE_BREATHING_DASHBOARD_INPUT } from "../dashboard";
import { generateWhispers } from "../whisper";
import { calculateAdaptiveDrift } from "../constellation";
import { evaluateEconomyMaturity, validateEconomyCopy } from "../economy";
import { assessEmotionalOverload, decideRecoveryMode } from "../safety";
import { canShowMythicEvent } from "../mythic";
import { buildMemorialGardenState } from "../legacy";
import { buildAtmosphereState } from "../atmosphere";
import { evaluateBrandCompatibility, revenueSystemSafe } from "../revenue";
import { decideCostGovernor } from "../infra";
import type { CivilizationSealReport, SealCheck } from "./types";

export function runCreatorAlchemyCivilizationSeal(): CivilizationSealReport {
  const checks: SealCheck[] = [
    checkFoundation(),
    checkDashboard(),
    checkWhisper(),
    checkConstellation(),
    checkEconomy(),
    checkSafety(),
    checkMythic(),
    checkLegacy(),
    checkAtmosphere(),
    checkRevenue(),
    checkInfra()
  ];

  const failedAreas = checks.filter((check) => !check.ok);
  const completedAreas = checks.filter((check) => check.ok).map((check) => check.area);

  return {
    ok: failedAreas.length === 0,
    completedAreas,
    failedAreas,
    seal: failedAreas.length === 0 ? "LUMORA_CREATOR_ALCHEMY_CIVILIZATION_SEAL" : "FAILED"
  };
}

function checkFoundation(): SealCheck {
  const density = validateEmotionalDensity({ majorInsights: 1, atmospheres: 1, symbolicMoments: 1 });
  const ok = validateRuleCoverage() && density.ok && validateCreatorAgency(DEFAULT_CREATOR_AGENCY);
  return { area: "foundation", ok, reason: ok ? "foundation_rules_safe" : "foundation_failed" };
}

function checkDashboard(): SealCheck {
  const model = buildBreathingDashboard(SAMPLE_BREATHING_DASHBOARD_INPUT);
  const ok = model.zones.includes("whisper_panel") && model.zones.includes("quiet_impact") && model.quietImpact.horizonProgress <= 1;
  return { area: "dashboard", ok, reason: ok ? "dashboard_synced" : "dashboard_failed" };
}

function checkWhisper(): SealCheck {
  const whispers = generateWhispers([
    { signal: "tone_softening", videoId: "v1", timestampSeconds: 42, strength: 0.9, sampleSize: 20 }
  ]);
  const ok = whispers.length === 1 && whispers[0]?.safe === true;
  return { area: "whisper", ok, reason: ok ? "whisper_safe" : "whisper_failed" };
}

function checkConstellation(): SealCheck {
  const drift = calculateAdaptiveDrift({
    creatorId: "c1",
    current: "midnight_souls",
    ancestral: "midnight_souls",
    toneShift: 0.45,
    audienceMutation: 0.55,
    creatorCuriosity: 0.4
  });
  const ok = drift.shouldDrift && drift.suggestedExposure <= 0.3;
  return { area: "constellation", ok, reason: ok ? "constellation_fluid" : "constellation_failed" };
}

function checkEconomy(): SealCheck {
  const maturity = evaluateEconomyMaturity({
    monthlyActiveCreators: 100,
    monthlyActiveUsers: 1000,
    antiFraudReady: false,
    moderationStable: false,
    creatorCultureStable: false
  });
  const ok = maturity.fiatBridgeAllowed === false && validateEconomyCopy("Quiet appreciation supports your resonance garden.");
  return { area: "economy", ok, reason: ok ? "economy_symbolic_first" : "economy_failed" };
}

function checkSafety(): SealCheck {
  const recovery = decideRecoveryMode({
    creatorId: "c1",
    daysSincePost: 30,
    recentPostFrequency: 0,
    emotionalLoad: 0.7,
    sanctuaryRequested: false
  });
  const overload = assessEmotionalOverload({
    insightsShownThisWeek: 1,
    ritualsShownThisMonth: 1,
    atmospheresShownThisWeek: 1,
    creatorDismissals: 0
  });
  const ok = recovery.preserveSeed && overload.level === "safe";
  return { area: "safety", ok, reason: ok ? "anti_burnout_safe" : "safety_failed" };
}

function checkMythic(): SealCheck {
  const ok =
    canShowMythicEvent({ type: "one_time_mirror", daysSinceLastShown: 365, emotionalOverloadLevel: "safe" }) &&
    !canShowMythicEvent({ type: "one_time_mirror", daysSinceLastShown: 30, emotionalOverloadLevel: "safe" });
  return { area: "mythic", ok, reason: ok ? "mythic_rare" : "mythic_failed" };
}

function checkLegacy(): SealCheck {
  const denied = buildMemorialGardenState({
    creatorId: "c1",
    creatorApproved: false,
    verifiedFamilyApproval: false
  });
  const ok = denied.active === false && denied.monetized === false;
  return { area: "legacy", ok, reason: ok ? "legacy_consent_first" : "legacy_failed" };
}

function checkAtmosphere(): SealCheck {
  const atmosphere = buildAtmosphereState({
    mood: "reflective",
    intensity: "soft",
    motionMode: "reduced",
    navigationVisible: true,
    primaryActionVisible: true
  });
  const ok = atmosphere.usabilitySafe && atmosphere.motion.allowParallax === false;
  return { area: "atmosphere", ok, reason: ok ? "atmosphere_usability_safe" : "atmosphere_failed" };
}

function checkRevenue(): SealCheck {
  const compatibility = evaluateBrandCompatibility({
    brandName: "Calm Studio",
    sponsorTone: "reflective",
    constellationAtmosphere: "reflective quiet creative depth",
    copy: "This week is quietly supported so creators can breathe."
  });
  const ok = compatibility.ok && revenueSystemSafe({
    patronageActive: true,
    fiatBridgeAllowed: false,
    antiCasinoPassed: true,
    creatorMajorityShare: true
  });
  return { area: "revenue", ok, reason: ok ? "revenue_non_interruptive" : "revenue_failed" };
}

function checkInfra(): SealCheck {
  const decision = decideCostGovernor({
    dailyBudgetUnits: 100,
    usedUnits: 95,
    requestedUnits: 20,
    feature: "mythic"
  });
  const ok = decision.allowed === false && decision.tier === "deferred";
  return { area: "infra", ok, reason: ok ? "infra_cost_governed" : "infra_failed" };
}
