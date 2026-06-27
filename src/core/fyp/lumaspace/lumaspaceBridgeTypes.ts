export interface FypToLumaSpaceInput {
  assetId: string;
  spaceId: string;
  userId: string;
  note?: string;
  sourceRoute: "/fyp";
}

export interface FypToLumaSpacePost {
  id: string;
  assetId: string;
  spaceId: string;
  userId: string;
  note: string;
  traceBackUrl: string;
  createdAt: number;
}
