export type LiveRuntimeSealInput = {
  activationLocks: string[];
  testsPassed: boolean;
  bridgesReady: boolean;
};

export function canSealLiveRuntime(input: LiveRuntimeSealInput): boolean {
  const required = [
    "pack1",
    "pack2",
    "pack3",
    "pack4",
    "pack5",
  ];

  const locks = new Set(input.activationLocks);

  return required.every((lock) => locks.has(lock)) && input.testsPassed && input.bridgesReady;
}
