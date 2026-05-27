import type { Fyp94ContentSource } from "../core/policy";

export type Fyp94RawSupplyClip = {
  externalId: string;
  source: Fyp94ContentSource;
  title: string;
  sourceUrl: string;
  mp4Url: string;
  posterUrl?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  tags: string[];
  licenseUrl?: string;
  attributionText?: string;
};

export type Fyp94SupplyClient = {
  source: Fyp94ContentSource;
  search(input: {
    query: string;
    limit: number;
  }): Promise<Fyp94RawSupplyClip[]>;
};
