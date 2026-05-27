export interface SoloSpace {
  id: string;
  atmosphere: string;
  protected: boolean;
}

export interface OnboardingFlow {
  id: string;
  stage: string;
  completed: boolean;
}

export interface OnboardingRuntime {
  active: boolean;
  flow: OnboardingFlow;
}
