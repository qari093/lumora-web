export type MemoryPatronage = {
  echoId: string;
  preventsDecay: true;
  publicFlex: false;
  privateDevotion: true;
};

export function createMemoryPatronage(echoId: string): MemoryPatronage {
  return {
    echoId,
    preventsDecay: true,
    publicFlex: false,
    privateDevotion: true,
  };
}
