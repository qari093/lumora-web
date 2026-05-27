export type RealityAnchor = {
  id: string;
  userId: string;
  capturedAt: string;
  privateByDefault: true;
};

export function createRealityAnchor(id: string, userId: string): RealityAnchor {
  return {
    id,
    userId,
    capturedAt: new Date().toISOString(),
    privateByDefault: true,
  };
}
