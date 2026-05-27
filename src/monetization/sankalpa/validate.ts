import { createSankalpa } from "./create";
import { computeSankalpaInfluence } from "./influence";
import { applySankalpaToState } from "./apply";

export function validateSankalpaFlow() {
  const s = createSankalpa({
    userId: "u1",
    statement: "I am here to rest",
    now: Date.now(),
  });

  const influence = computeSankalpaInfluence({
    sankalpa: s.statement,
  });

  const final = applySankalpaToState({
    baseTolerance: 0.5,
    sankalpaTolerance: influence.adTolerance,
  });

  return {
    ok: final <= 0.5,
    final,
  };
}
