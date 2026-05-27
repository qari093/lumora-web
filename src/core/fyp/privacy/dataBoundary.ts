export type DataBoundary = {
  userId: string;
  exportAllowed: boolean;
  aiTrainingAllowed: boolean;
  encrypted: boolean;
};

export function createDataBoundary(input: {
  userId: string;
  aiTrainingAllowed: boolean;
}): DataBoundary {
  return {
    userId: input.userId,
    exportAllowed: true,
    aiTrainingAllowed: input.aiTrainingAllowed,
    encrypted: true
  };
}
