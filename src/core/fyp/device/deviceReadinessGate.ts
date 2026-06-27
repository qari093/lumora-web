import { validateDeviceMatrix } from "./deviceMatrix";
import {
  handleFypInterruption,
  type FypInterruption
} from "./interruptionPolicy";

export function validateDeviceRealityReadiness(): boolean {
  const interruptions: FypInterruption[] = [
    "rotate_landscape",
    "incoming_call",
    "background_app",
    "long_press",
    "swipe_during_load",
    "low_power_mode"
  ];

  return (
    validateDeviceMatrix() &&
    interruptions.every(item => handleFypInterruption(item).safe)
  );
}
