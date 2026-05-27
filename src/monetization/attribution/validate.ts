import { attributeAdValue } from "./model";
import { AdImpression } from "./impression";
import { AdEngagement } from "./engagement";
import { AdConversion } from "./conversion";

export function validateAttributionAccuracy(input: {
  impression: AdImpression;
  engagements: AdEngagement[];
  conversion?: AdConversion;
}) {
  const attribution = attributeAdValue(input);

  return {
    ok:
      attribution.impressionId === input.impression.impressionId &&
      attribution.campaignId === input.impression.campaignId &&
      attribution.totalAttributedValue >= 0,
    attribution,
  };
}
