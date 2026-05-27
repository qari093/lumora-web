export function createCreatorChronicle(input: {
  promisedPosts: number;
  deliveredPosts: number;
  collaborations: number;
  disputes: number;
}) {
  return {
    summary: `${input.deliveredPosts} of ${input.promisedPosts} promised posts delivered. ${input.collaborations} collaborations, ${input.disputes} disputes.`,
  };
}
