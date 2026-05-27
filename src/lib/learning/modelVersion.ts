export const MODEL_VERSION = "baseline_v1";

export function attachModelVersion(x:any){
  return {
    ...x,
    model_version: MODEL_VERSION
  };
}
