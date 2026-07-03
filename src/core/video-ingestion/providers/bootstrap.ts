import { registerUniversalProvider } from "./registry";
import { genesisUniversalAdapter } from "./adapters";

export function bootstrapUniversalVideoProviders() {
  registerUniversalProvider(genesisUniversalAdapter);

  return {
    registered: ["genesis"],
    count: 1,
  };
}
