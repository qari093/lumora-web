export type PersonaExpansionPack = {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
};

export function listPersonaExpansionPacks(): PersonaExpansionPack[] {
  return [
    {
      id: "base",
      title: "Base Persona Pack",
      description: "Default persona expansion pack",
      enabled: true,
    },
  ];
}
