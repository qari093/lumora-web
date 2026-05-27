export function canViewSavedMoment(input: { ownerId: string; viewerId: string; shared: boolean }) {
  return input.shared || input.ownerId === input.viewerId;
}
