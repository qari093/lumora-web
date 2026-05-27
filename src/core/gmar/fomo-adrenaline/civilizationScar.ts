export type CivilizationScar = {
  id: string;
  permanent: true;
  source: "failed_global_event" | "historic_loss";
  grantsPower: false;
  plaqueVisible: true;
};

export function createCivilizationScar(id: string): CivilizationScar {
  return {
    id,
    permanent: true,
    source: "failed_global_event",
    grantsPower: false,
    plaqueVisible: true,
  };
}
