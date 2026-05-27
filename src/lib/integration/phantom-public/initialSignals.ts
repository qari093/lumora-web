export type InitialPhantomSignal = {
  userId: string;
  type: "present" | "hold" | "silent-ovation";
  createdAt: string;
  humanOnly: true;
};

export function captureInitialPhantomSignal(input: {
  userId: string;
  type: InitialPhantomSignal["type"];
  createdAt?: string;
}): InitialPhantomSignal {
  return {
    userId: input.userId,
    type: input.type,
    createdAt: input.createdAt || new Date().toISOString(),
    humanOnly: true,
  };
}
