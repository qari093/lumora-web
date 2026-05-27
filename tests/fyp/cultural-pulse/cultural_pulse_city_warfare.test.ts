import { describe, expect, it } from "vitest";

import {
  createCityPulse,
  createGlobalPulseWave
} from "@/src/core/fyp/cultural-pulse/pulseEngine";

import {
  createLocalCulturalSignal,
  calculatePulseAmplification
} from "@/src/core/fyp/cultural-pulse/localSignals";

import {
  createVibeTide
} from "@/src/core/fyp/vibe-tides/vibeTide";

import {
  crownBlockStar,
  isActiveBlockStar
} from "@/src/core/fyp/vibe-tides/blockStar";

import {
  createCityWarStatus
} from "@/src/core/fyp/vibe-tides/cityWarfare";

describe("Lumora FYP Cultural Pulse + City Warfare", () => {
  it("creates city pulse", () => {
    const pulse = createCityPulse({
      cityId: "berlin",
      cityName: "Berlin",
      country: "Germany",
      dominantMode: "chaos",
      activeUsers: 5000,
      pulseStrength: 300
    });

    expect(pulse.cityName).toBe("Berlin");
    expect(pulse.dominantMode).toBe("chaos");
  });

  it("creates global pulse wave", () => {
    const berlin = createCityPulse({
      cityId: "berlin",
      cityName: "Berlin",
      country: "Germany",
      dominantMode: "chaos",
      activeUsers: 5000,
      pulseStrength: 300
    });

    const seoul = createCityPulse({
      cityId: "seoul",
      cityName: "Seoul",
      country: "South Korea",
      dominantMode: "chaos",
      activeUsers: 7000,
      pulseStrength: 400
    });

    const wave = createGlobalPulseWave({
      mode: "chaos",
      cities: [berlin, seoul]
    });

    expect(wave.trend).toBe("rising");
    expect(wave.totalEnergy).toBe(700);
  });

  it("calculates pulse amplification", () => {
    const amplification = calculatePulseAmplification([
      createLocalCulturalSignal({
        cityId: "berlin",
        category: "nightlife",
        energyBoost: 20,
        expiresAt: 999999
      }),
      createLocalCulturalSignal({
        cityId: "berlin",
        category: "festival",
        energyBoost: 30,
        expiresAt: 999999
      })
    ]);

    expect(amplification).toBe(50);
  });

  it("creates vibe tide", () => {
    const tide = createVibeTide({
      mode: "drift",
      closesAt: 999999,
      cityScores: [
        {
          cityName: "Berlin",
          score: 120
        },
        {
          cityName: "Seoul",
          score: 180
        }
      ]
    });

    expect(tide.winningCity).toBe("Seoul");
  });

  it("crowns active block star", () => {
    const blockStar = crownBlockStar({
      creatorId: "creator_001",
      district: "Kreuzberg",
      impactQuotient: 900,
      now: 100
    });

    expect(
      isActiveBlockStar({
        blockStar,
        now: 200
      })
    ).toBe(true);
  });

  it("creates city war status", () => {
    const tide = createVibeTide({
      mode: "chaos",
      closesAt: 999999,
      cityScores: [
        {
          cityName: "Berlin",
          score: 300
        },
        {
          cityName: "Tokyo",
          score: 250
        }
      ]
    });

    const status = createCityWarStatus(tide);

    expect(status.activeCities).toBe(2);
    expect(status.winningCity).toBe("Berlin");
  });
});
