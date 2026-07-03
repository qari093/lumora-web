import type { CreateShareInput } from "../foundation/types";
import { universalShareDestinations, type UniversalShareDestination } from "./destinations";

export type ShareRankingContext = {
  recentDestinationIds?: string[];
  favoriteDestinationIds?: string[];
  sourcePortal?: CreateShareInput["sourcePortal"];
  mood?: string;
};

export function rankShareDestinations(context: ShareRankingContext = {}): UniversalShareDestination[] {
  const recent = new Set(context.recentDestinationIds ?? []);
  const favorites = new Set(context.favoriteDestinationIds ?? []);

  return [...universalShareDestinations]
    .map((destination) => {
      let score = destination.priority;
      if (recent.has(destination.id)) score += 18;
      if (favorites.has(destination.id)) score += 24;
      if (context.sourcePortal === "fyp" && destination.id === "lumaspace") score += 20;
      if (context.sourcePortal === "lumaspace" && destination.id === "lumalink") score += 16;
      if (context.mood === "calm" && destination.supportsSilent) score += 8;
      return { destination, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.destination);
}
