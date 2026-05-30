export * from "./buildDashboard";
export * from "./sampleModel";

import { buildBreathingDashboard as _build } from "./buildDashboard";
import { SAMPLE_BREATHING_DASHBOARD_INPUT as _sample } from "./sampleModel";

export const buildBreathingDashboard = _build;
export const SAMPLE_BREATHING_DASHBOARD_INPUT = _sample;
