import { SanctuaryConstitution } from "../constitution/sanctuaryConstitution";
import { VisualDoctrine } from "../design/visualDoctrine";

export function validateSanctuaryConstitution() {
  return (
    SanctuaryConstitution.philosophy.atmosphereFirst &&
    SanctuaryConstitution.philosophy.userIsCenter &&
    SanctuaryConstitution.limits.initialVisibleText <= 3 &&
    SanctuaryConstitution.ratios.serenity === 0.70 &&
    VisualDoctrine.atmosphereBeforeInterface &&
    VisualDoctrine.worldBeforeLabel &&
    VisualDoctrine.centerOnYou
  );
}
