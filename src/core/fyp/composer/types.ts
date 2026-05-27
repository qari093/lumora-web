export interface FeedComposerItem {
  id: string;
  lane: string;
  rankScore: number;
  qualityScore: number;
}

export interface FeedComposerResult extends FeedComposerItem {
  composedRank: number;
}

export interface FeedComposerRuntimeResult {
  ok: true;
  total: number;
  items: FeedComposerResult[];
}
