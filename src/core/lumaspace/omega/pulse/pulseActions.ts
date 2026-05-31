import type { SignalAction, PulseSignal } from "./types";

export type PulseActionResult = {
  signalId: string;
  action: SignalAction;
  accepted: boolean;
  nextIntent: "gratitude" | "reflection" | "mission" | "bridge" | "memory";
};

export function performPulseAction(signal: PulseSignal, action: SignalAction): PulseActionResult {
  if (!signal.actions.includes(action)) {
    return {
      signalId: signal.id,
      action,
      accepted: false,
      nextIntent: "reflection",
    };
  }

  const nextIntentByAction: Record<SignalAction, PulseActionResult["nextIntent"]> = {
    send_light: "gratitude",
    resonate: "reflection",
    weave: "memory",
    join_mission: "mission",
    open_bridge: "bridge",
  };

  return {
    signalId: signal.id,
    action,
    accepted: true,
    nextIntent: nextIntentByAction[action],
  };
}
