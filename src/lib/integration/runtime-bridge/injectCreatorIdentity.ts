export function injectCreatorIdentity(feedItem: any, creator: any) {
  return {
    ...feedItem,
    creator: {
      id: creator.id,
      name: creator.name,
    },
  };
}
