import { describe, expect, it } from "vitest";

import {
  createConductorState,
  evolveConductorState
} from "@/src/core/fyp/conductor/conductorEngine";

import {
  createConductorWhisper,
  generateWhisperTone
} from "@/src/core/fyp/conductor/whispers";

import {
  createWeeklyReflection
} from "@/src/core/fyp/reflections/weeklyReflection";

import {
  createReflectionShareCard
} from "@/src/core/fyp/reflections/shareCard";

import {
  generateIdentitySignature
} from "@/src/core/fyp/reflections/identitySignature";

describe("Lumora FYP Conductor AI + Reflections", () => {
  it("creates conductor state", () => {
    const state = createConductorState({
      userId: "waqar"
    });

    expect(state.enabled).toBe(true);
    expect(state.persona).toBe("poetic");
  });

  it("evolves conductor state", () => {
    const state = createConductorState({
      userId: "waqar",
      adaptationLevel: 10,
      trustScore: 20
    });

    const evolved = evolveConductorState(state);

    expect(evolved.adaptationLevel).toBe(15);
    expect(evolved.trustScore).toBe(23);
  });

  it("creates conductor whisper", () => {
    const whisper = createConductorWhisper({
      mode: "chaos",
      tone: generateWhisperTone(90),
      message: "You drowned in Chaos last night. Respect."
    });

    expect(whisper.tone).toBe("volatile");
  });

  it("creates weekly reflection share card", () => {
    const reflection = createWeeklyReflection({
      userId: "waqar",
      dominantMode: "drift",
      atmosphereHours: 14,
      emotionalSignature: "neon after rain"
    });

    const card = createReflectionShareCard(reflection);

    expect(card.viralReady).toBe(true);
  });

  it("generates identity signature", () => {
    const signature = generateIdentitySignature({
      userId: "waqar",
      chaosHours: 5,
      driftHours: 14,
      deepHours: 9
    });

    expect(signature.title).toBe("Nocturnal Architect");
  });
});
