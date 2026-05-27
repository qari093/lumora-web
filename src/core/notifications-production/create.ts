export function createNotification(input: {
  userId: string;
  type: string;
  message: string;
}) {
  return {
    id: `notification-${input.userId}-${Date.now()}`,
    ...input,
    read: false,
    createdAt: new Date().toISOString(),
  };
}
