export type Fyp94TrendInput = {
  id: string;
  source: "google_trends" | "youtube_metadata" | "internal_heat";
  title: string;
  keywords: string[];
  category: string;
  capturedAt: string;
};

export type Fyp94TrendMappedQuery = {
  trendId: string;
  query: string;
  category: string;
  caption: string;
  styleLabel: "adrenaline" | "comedy" | "travel" | "sports" | "cinematic";
};
