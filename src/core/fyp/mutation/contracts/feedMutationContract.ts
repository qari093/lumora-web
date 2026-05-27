import type {
  FeedMutation,
  FeedMutationType
} from "../types";

const TYPES: FeedMutationType[] = [
  "boost",
  "suppress",
  "insert",
  "remove"
];

export function validateFeedMutation(
  mutation: FeedMutation
): boolean {
  return Boolean(
    mutation.id &&
      mutation.itemId &&
      TYPES.includes(mutation.type) &&
      Number.isFinite(mutation.weight) &&
      mutation.weight >= 0
  );
}
