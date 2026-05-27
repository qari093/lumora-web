import { describe, expect, it } from "vitest";

import {
  createRuntimeSession
} from "@/src/core/fyp/runtime/session";

import {
  calculateEmotionalLoad
} from "@/src/core/fyp/runtime/loadBalancer";

import {
  evaluateModeTransition
} from "@/src/core/fyp/runtime/engines/modeTransition";

import {
  assembleRuntimeFeed
} from "@/src/core/fyp/runtime/engines/feedAssembler";

import {
  createRuntimeHeartbeat
} from "@/src/core/fyp/runtime/engines/runtimeHeartbeat";

import {
  orchestrateRuntime
} from "@/src/core/fyp/runtime/runtimeOrchestrator";

describe("Lumora FYP Feed Runtime Orchestration", () => {
  it("creates runtime session", () => {
    const session = createRuntimeSession({
      userId: "waqar",
      mode: "drift"
    });

    expect(session.active).toBe(true);
    expect(session.mode).toBe("drift");
  });

  it("calculates emotional load", () => {
    const load = calculateEmotionalLoad([
      {
        id: "1",
        emotionalWeight: 80,
        category: "chaos"
      },
      {
        id: "2",
        emotionalWeight: 60,
        category: "calm"
      }
    ]);

    expect(load).toBe(70);
  });

  it("evaluates mode transition", () => {
    const transition = evaluateModeTransition({
      currentMode: "drift",
      emotionalLoad: 60,
      chaosBudget: 90
    });

    expect(transition.nextMode).toBe("chaos");
    expect(transition.injectChaos).toBe(true);
  });

  it("assembles runtime feed", () => {
    const feed = assembleRuntimeFeed({
      primary: [
        { id: "1", emotionalWeight: 10, category: "a" },
        { id: "2", emotionalWeight: 20, category: "a" }
      ],
      exploration: [
        { id: "3", emotionalWeight: 30, category: "b" }
      ],
      anomalies: [
        { id: "4", emotionalWeight: 40, category: "c" }
      ]
    });

    expect(feed.length).toBe(4);
  });

  it("creates runtime heartbeat", () => {
    const heartbeat = createRuntimeHeartbeat({
      sessionId: "runtime_1",
      latencyMs: 120
    });

    expect(heartbeat.stable).toBe(true);
  });

  it("orchestrates runtime feed state", () => {
    const runtime = orchestrateRuntime({
      mode: "drift",
      chaosBudget: 90,
      items: [
        {
          id: "1",
          emotionalWeight: 70,
          category: "pulse"
        },
        {
          id: "2",
          emotionalWeight: 60,
          category: "chaos"
        }
      ]
    });

    expect(runtime.emotionalLoad).toBe(65);
    expect(runtime.transition.nextMode).toBe("chaos");
  });
});
