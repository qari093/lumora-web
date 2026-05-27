export interface LastLightState {
  visible: boolean;
  message: string;
  guiltPressure: false;
}

export function buildLastLightState(input: {
  creatorInactiveDays: number;
  creatorOptedIntoPresenceMemory: boolean;
}): LastLightState {
  const visible = input.creatorInactiveDays >= 90 && input.creatorOptedIntoPresenceMemory;

  return {
    visible,
    message: visible ? "This space still remembers quietly." : "",
    guiltPressure: false
  };
}
