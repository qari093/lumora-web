export interface EchoWhisper {
  visible: boolean;
  phrase: string;
}

export function createWeeklyWhisper(day: number): EchoWhisper {
  if (day % 10 === 0) {
    return {
      visible: true,
      phrase: "A quiet shape has formed."
    };
  }

  return {
    visible: false,
    phrase: ""
  };
}
