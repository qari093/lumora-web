import type {
  FeedRouteQuery,
  FeedRouteResult
} from "../types";

export function validateFeedRouteQuery(
  query: FeedRouteQuery
): boolean {
  return Boolean(
    query.userId &&
      query.sessionId &&
      Number.isInteger(query.limit) &&
      query.limit > 0 &&
      query.limit <= 50
  );
}

export function validateFeedRouteResult(
  result: FeedRouteResult
): boolean {
  return Boolean(
    result.ok === true &&
      result.route === "/api/fyp/feed" &&
      result.userId &&
      result.status === 200
  );
}
