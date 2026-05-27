import { AdImpression } from "./impression";
import { AdEngagement, scoreAdEngagement } from "./engagement";
import { AdConversion } from "./conversion";

export function attributeAdValue(input: {
  impression: AdImpression;
  engagements: AdEngagement[];
  conversion?: AdConversion;
}) {
  const engagementScore = scoreAdEngagement(input.engagements);
  const conversionValue = input.conversion?.value ?? 0;
  const valid = input.impression.valid && engagementScore >= 0;

  return {
    valid,
    impressionId: input.impression.impressionId,
    campaignId: input.impression.campaignId,
    engagementScore: Number(Math.max(0, engagementScore).toFixed(2)),
    conversionValue,
    totalAttributedValue: Number((Math.max(0, engagementScore) + conversionValue).toFixed(2)),
  };
}
