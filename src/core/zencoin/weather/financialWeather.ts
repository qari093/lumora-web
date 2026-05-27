export const financialWeather = {
  seasonalMode: true,
  privacySafe: true,
  nonPsychological: true,
  widgetEnabled: true
} as const;

export function weatherMessage(): string {
  return "The world outside is calm; may your economy be gentle too.";
}

export function weatherHealthy(): boolean {
  return (
    financialWeather.seasonalMode &&
    financialWeather.privacySafe &&
    financialWeather.nonPsychological &&
    financialWeather.widgetEnabled
  );
}
