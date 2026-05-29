export function createLensComposer() {
  return {
    id: "lens_001",
    mode: "emotional-physics"
  };
}

export {
  createLensFrame,
  runLumaLensRuntime,
  validateRawLens
} from "@/core/lumaspace/compat/legacyContracts";
