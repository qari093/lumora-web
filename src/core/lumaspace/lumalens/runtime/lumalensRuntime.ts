export function runLumaLensRuntime() {
  return {
    active: true,
    lensId: "lens_001"
  };
}

export {
  createLensFrame,
  validateRawLens
} from "@/core/lumaspace/compat/legacyContracts";
