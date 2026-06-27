import { describe, it, expect } from "vitest";

import {
  FYP_DEVICE_MATRIX,
  FYP_NETWORK_MATRIX,
  validateDeviceMatrix
} from "../../../src/core/fyp/device/deviceMatrix";

import {
  handleFypInterruption
} from "../../../src/core/fyp/device/interruptionPolicy";

import {
  validateDeviceRealityReadiness
} from "../../../src/core/fyp/device/deviceReadinessGate";

describe("FYP Omega Pack 18", () => {
  it("defines real device matrix", () => {
    expect(validateDeviceMatrix()).toBe(true);
    expect(FYP_DEVICE_MATRIX.some(device => device.name === "iPhone 8")).toBe(true);
    expect(FYP_DEVICE_MATRIX.some(device => device.name === "Samsung Galaxy A12")).toBe(true);
  });

  it("includes 3g and offline network tests", () => {
    expect(FYP_NETWORK_MATRIX.some(network => network.name === "3g")).toBe(true);
    expect(FYP_NETWORK_MATRIX.some(network => network.name === "offline")).toBe(true);
  });

  it("handles mobile interruptions safely", () => {
    expect(handleFypInterruption("incoming_call").action).toBe("pause_and_mute_then_resume");
    expect(handleFypInterruption("long_press").action).toBe("prevent_browser_menu_show_deep_dive");
    expect(handleFypInterruption("swipe_during_load").safe).toBe(true);
  });

  it("passes device reality readiness gate", () => {
    expect(validateDeviceRealityReadiness()).toBe(true);
  });
});
