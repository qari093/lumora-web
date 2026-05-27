export function routeOnboardingUserToPhantom(input: {
  userId: string;
  witnessName: string;
}) {
  return {
    userId: input.userId,
    witnessName: input.witnessName,
    destination: "phantom-circle",
    routed: true,
  };
}
