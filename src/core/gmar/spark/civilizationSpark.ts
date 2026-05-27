export type CivilizationSpark = {
  id: string;
  text: string;
  private: true;
  secondsToConsume: number;
};

export function createDailyCivilizationSpark(name = "traveler"): CivilizationSpark {
  return {
    id: "daily-spark",
    text: `Today, ${name}, the world remembers your light.`,
    private: true,
    secondsToConsume: 5,
  };
}
