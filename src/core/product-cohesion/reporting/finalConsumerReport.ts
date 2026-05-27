import { productCohesionSeal } from "../readiness/productCohesionSeal";

export function finalConsumerReport() {
  return {
    status: productCohesionSeal.sealed ? "PASS" : "FAILED",
    stepsCompleted: productCohesionSeal.stepsCompleted,
    codePacksCompleted: productCohesionSeal.codePacksCompleted
  };
}
