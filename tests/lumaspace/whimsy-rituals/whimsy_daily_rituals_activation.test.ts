import { describe, expect, it } from "vitest";

import {
  validateWhimsyEffect
} from "@/src/core/lumaspace/whimsy/contracts/whimsyContract";

import {
  createRawLensWhimsy
} from "@/src/core/lumaspace/whimsy/runtime/rawLensWhimsy";

import {
  createGlitchSparkPlan
} from "@/src/core/lumaspace/whimsy/runtime/glitchSpark";

import {
  createEmotionRoulette
} from "@/src/core/lumaspace/whimsy/runtime/emotionRoulette";

import {
  runWhimsyRuntime
} from "@/src/core/lumaspace/whimsy/runtime/whimsyRuntime";

import {
  validateDailyArrival,
  validateEchoSeed
} from "@/src/core/lumaspace/rituals/contracts/ritualContract";

import {
  createEchoSeed
} from "@/src/core/lumaspace/rituals/runtime/echoSeed";

import {
  createDailyArrival,
  openMorningPortal
} from "@/src/core/lumaspace/rituals/runtime/morningPortal";

import {
  createAuraWeather
} from "@/src/core/lumaspace/rituals/runtime/auraWeather";

import {
  runDailyRitualRuntime
} from "@/src/core/lumaspace/rituals/runtime/ritualRuntime";

describe("LumaSpace Whimsy and Daily Rituals Activation", () => {
  it("creates safe raw lens whimsy", () => {
    const effect = createRawLensWhimsy("comic", 0.6);

    expect(validateWhimsyEffect(effect)).toBe(true);
  });

  it("creates non-repeatable glitch spark plan", () => {
    const plan = createGlitchSparkPlan("spark_001", 3);

    expect(plan.sparkId).toBe("spark_001");
    expect(plan.repeatable).toBe(false);
  });

  it("creates emotion roulette remix", () => {
    const result = createEmotionRoulette("calm", 2);

    expect(result.surprise).toBe(true);
    expect(result.remixStyle).toBe("dream_pop");
  });

  it("runs whimsy runtime", () => {
    const runtime = runWhimsyRuntime("spark_001");

    expect(runtime.active).toBe(true);
    expect(runtime.glitch.sparkId).toBe("spark_001");
  });

  it("creates valid echo seed", () => {
    const seed = createEchoSeed("wonder");

    expect(validateEchoSeed(seed)).toBe(true);
    expect(seed.optional).toBe(true);
  });

  it("creates daily arrival", () => {
    const arrival = createDailyArrival(4);

    expect(validateDailyArrival(arrival)).toBe(true);
    expect(arrival.type).toBe("stardust_whisper");
    expect(arrival.ephemeral).toBe(true);
  });

  it("opens morning portal", () => {
    const portal = openMorningPortal(0);

    expect(portal.opened).toBe(true);
    expect(portal.durationMs).toBe(3000);
  });

  it("creates aura weather", () => {
    const weather = createAuraWeather("constellation_001", "dream");

    expect(weather.constellationId).toBe("constellation_001");
    expect(weather.atmosphere).toBe("dream");
  });

  it("runs daily ritual runtime", () => {
    const runtime = runDailyRitualRuntime("user_001");

    expect(runtime.active).toBe(true);
    expect(runtime.userId).toBe("user_001");
    expect(runtime.portal.arrival.type).toBe("stardust_whisper");
  });
});
