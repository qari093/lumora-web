export type CineVerseSourceType =
  | "youtube"
  | "internet_archive"
  | "institutional_embed"
  | "deep_link"
  | "webtorrent_public_domain";

export type CineVerseFederatedVideo = {
  id: string;
  title: string;
  sourceType: CineVerseSourceType;
  sourceUrl: string;
  embeddable: boolean;
  rightsVerified: boolean;
  regionBlocked?: boolean;
};
