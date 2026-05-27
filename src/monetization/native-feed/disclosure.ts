export function buildSponsoredDisclosure(input: {
  sponsorName: string;
}) {
  return {
    label: "Sponsored",
    text: `Sponsored by ${input.sponsorName}`,
    visible: true,
    userTransparent: true,
  };
}
