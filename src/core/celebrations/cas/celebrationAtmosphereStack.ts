export type CASRuntime = {
  active: boolean;
  emotionalVector: number;
};

export function createCASRuntime(): CASRuntime {
  return {
    active: true,
    emotionalVector: 0.5
  };
}
