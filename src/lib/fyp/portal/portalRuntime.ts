export interface AtmosphericPortal {
  id: string;
  surpriseFactor: number;
}

export function createPortal(id: string): AtmosphericPortal {
  return {
    id,
    surpriseFactor: Math.random()
  };
}
