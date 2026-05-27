export interface EchoChain {
  id: string;
  depth: number;
  atmosphere: string;
}

export interface ChainLink {
  id: string;
  userId: string;
  duration: number;
}

export interface EchoChainRuntime {
  active: boolean;
  chain: EchoChain;
}
