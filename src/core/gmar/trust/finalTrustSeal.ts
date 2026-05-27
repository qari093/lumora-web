import { zenEconomyUsePolicyHealthy } from "../zeneconomy/allowedUses";
import { gmarEmotionalContractHealthy } from "./emotionalContract";
import { resonancePrivacyHealthy } from "./resonancePrivacy";
import { lonelyWorldHealthy } from "../lonely-world/scripts";

export type GmarTrustSeal = {
  system: "GMAR Trust Seal";
  status: "PASS" | "FAILED";
  zeneconomySafe: boolean;
  emotionalContractSafe: boolean;
  resonancePrivacySafe: boolean;
  lonelyWorldSafe: boolean;
};

export function createGmarTrustSeal(): GmarTrustSeal {
  const zeneconomySafe = zenEconomyUsePolicyHealthy();
  const emotionalContractSafe = gmarEmotionalContractHealthy();
  const resonancePrivacySafe = resonancePrivacyHealthy();
  const lonelyWorldSafe = lonelyWorldHealthy();

  return {
    system: "GMAR Trust Seal",
    status:
      zeneconomySafe && emotionalContractSafe && resonancePrivacySafe && lonelyWorldSafe
        ? "PASS"
        : "FAILED",
    zeneconomySafe,
    emotionalContractSafe,
    resonancePrivacySafe,
    lonelyWorldSafe,
  };
}
