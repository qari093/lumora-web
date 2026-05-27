export type OpenCanonRegion =
  | "india"
  | "punjabi"
  | "korea"
  | "japan"
  | "africa"
  | "latin-america"
  | "europe"
  | "soviet"
  | "indie"
  | "public-domain";

export type OpenCanonFilm = {
  id: string;
  title: string;
  region: OpenCanonRegion;
  sourceUrl: string;
  rightsVerified: boolean;
  embeddable: boolean;
  emotionalTags: string[];
};
