export type InfiniteScrollState = {
  cursor: string | null;
  hasMore: boolean;
  batchSize: number;
};

export function getInfiniteScrollState(): InfiniteScrollState {
  return {
    cursor: "page_2",
    hasMore: true,
    batchSize: 12,
  };
}
