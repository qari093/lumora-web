export type SquadEcho = {
  squadId: string;
  members: number;
  permanent: true;
};

export function createSquadEcho(
  squadId: string,
  members: number
): SquadEcho {
  return {
    squadId,
    members,
    permanent: true
  };
}
