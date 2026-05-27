export function createMemoryPage(id: string) {
  return {
    id,
    url: `/memory/${id}`,
    countsHidden: true,
    commentsHidden: true,
  };
}
