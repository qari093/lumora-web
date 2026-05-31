import { createPulseSignal } from "./signalEngine";
import { scorePulseSignal, rankPulseSignals, applySignalDiversity } from "./rankingEngine";
import { createPulseCycle, completePulseCycle, createPulseReflection } from "./pulseCycle";
import { injectBridgeSignal, injectMissionSignal, injectWisdomSignal } from "./injectionEngine";
import { performPulseAction } from "./pulseActions";

export function runLumaSpaceOmegaMegaPack05Runtime() {
  let signals = [
    createPulseSignal({
      id: "s1",
      kind: "living_card_update",
      creatorId: "c1",
      title: "A new Living Card glow",
      emotionalWeight: 75,
      trustScore: 80,
      freshness: 90,
      diversityKey: "identity",
    }),
    createPulseSignal({
      id: "s2",
      kind: "celebration",
      creatorId: "c2",
      title: "A community bloom opened",
      emotionalWeight: 85,
      trustScore: 88,
      freshness: 70,
      diversityKey: "celebration",
    }),
  ];

  signals = injectWisdomSignal(signals, "omega-citizen-005");
  signals = injectMissionSignal(signals, "lumasp-builders");
  signals = injectBridgeSignal(signals, "omega-citizen-005");

  const ranked = applySignalDiversity(rankPulseSignals(signals));
  const cycle = completePulseCycle(createPulseCycle({
    citizenId: "omega-citizen-005",
    signals: ranked,
    maxSignals: 8,
  }));

  const reflection = createPulseReflection(cycle);
  const action = performPulseAction(cycle.signals[0], cycle.signals[0].actions[0]);

  return {
    ok:
      ranked.length >= 5 &&
      scorePulseSignal(ranked[0]) >= scorePulseSignal(ranked[ranked.length - 1]) &&
      cycle.completed &&
      reflection.suggestedActions.includes("create_memory") &&
      action.accepted,
    signals,
    ranked,
    cycle,
    reflection,
    action,
  };
}
