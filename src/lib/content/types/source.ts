export type LicenseType =
  | "public-domain"
  | "cc0"
  | "cc-by"
  | "platform-safe";

export type SourcePlatform =
  | "nasa" | "esa" | "eso" | "hubble"
  | "internet-archive" | "prelinger" | "fedflix"
  | "loc" | "smithsonian" | "europeana"
  | "open-images" | "wikimedia"
  | "pexels" | "pixabay" | "coverr" | "mixkit"
  | "dareful" | "distill" | "life-of-vids" | "splitshire"
  | "pond5" | "mazwai" | "free-stock-footage" | "beachfront"
  | "cutestock"
  | "aljazeera" | "gongu" | "digitalnz"
  | "noaa" | "usgs" | "pdr"
  | "free-nature" | "natureclip" | "wellcome"
  | "euscreen" | "padma"
  | "vidsplay" | "videvo"
  | "clacso" | "aodl"
  | "libreflix" | "nhk" | "nfsa"
  | "prasar"
  | "youtube" | "vimeo"
  | "lumora";

export interface ContentSource {
  id: SourcePlatform;
  name: string;
  license: LicenseType;
  attributionRequired: boolean;
  commercialUse: boolean;
  requiresPerItemCheck: boolean;
  embedAllowed: boolean;
  priority: number;
}
