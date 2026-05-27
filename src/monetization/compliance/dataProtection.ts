export function validateDataProtection(input: {
  usesDemographics: boolean;
  usesRawSensitiveData: boolean;
  usesSignalOnlyTargeting: boolean;
  userCanOptOut: boolean;
}) {
  return {
    ok:
      input.usesDemographics === false &&
      input.usesRawSensitiveData === false &&
      input.usesSignalOnlyTargeting === true &&
      input.userCanOptOut === true,
  };
}
