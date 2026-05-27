export function attachPresentation(page: any, ids: string[]) {
  return {
    ...page,
    silhouettes: Array.from(new Set(ids)).map(i => ({ id: i, anonymous: true })),
  };
}
