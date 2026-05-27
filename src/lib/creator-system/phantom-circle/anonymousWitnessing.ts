import type { PhantomCircleMember } from "./phantomCircleModel";

export type AnonymousWitnessView = {
  witnessName: string;
  anonymous: true;
  profileHidden: true;
};

export function buildAnonymousWitnessView(member: PhantomCircleMember): AnonymousWitnessView {
  return {
    witnessName: member.witnessName,
    anonymous: true,
    profileHidden: true,
  };
}

export function buildAnonymousRoom(members: PhantomCircleMember[]): AnonymousWitnessView[] {
  return members.map(buildAnonymousWitnessView);
}
