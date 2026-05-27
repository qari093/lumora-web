export type EchoMonument = {
  id: string;
  title: string;
  kind: "founding" | "player" | "civilization";
  permanent: boolean;
  visibleInSky: boolean;
};

export function createFoundingEcho(id: string, title = "Founding Echo"): EchoMonument {
  return {
    id,
    title,
    kind: "founding",
    permanent: true,
    visibleInSky: true,
  };
}

export function createFoundingEchoSet(): EchoMonument[] {
  return Array.from({ length: 5 }).map((_, index) =>
    createFoundingEcho(`founding-echo-${index + 1}`, `Founding Echo ${index + 1}`),
  );
}
