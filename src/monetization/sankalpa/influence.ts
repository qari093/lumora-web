export function computeSankalpaInfluence(input: {
  sankalpa: string;
}) {
  const text = input.sankalpa.toLowerCase();

  if (text.includes("calm") || text.includes("rest")) {
    return { adTolerance: 0.2 };
  }

  if (text.includes("explore") || text.includes("learn")) {
    return { adTolerance: 0.5 };
  }

  return { adTolerance: 0.35 };
}
