export interface FypShareSheetState {
  open: boolean;
  selectedAssetId?: string;
  selectedSpaceId?: string;
}

export function openFypShareSheet(
  assetId: string
): FypShareSheetState {
  return {
    open: true,
    selectedAssetId: assetId
  };
}

export function selectFypTargetSpace(
  state: FypShareSheetState,
  spaceId: string
): FypShareSheetState {
  return {
    ...state,
    selectedSpaceId: spaceId
  };
}
