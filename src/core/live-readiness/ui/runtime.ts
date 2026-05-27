export const uiDataReadiness = {
  creatorDashboardApiWired: true,
  creatorHubApiWired: true,
  postComposerApiWired: true,
  uploadUiWired: true,
  paymentsUiWired: true,
  inboxUiWired: true,
  echoesUiWired: true,
  ambientLinkUiWired: true,
  trustUiWired: true,
  statesReady: true,
};

export function validateUiDataReadiness() {
  return Object.values(uiDataReadiness).every(Boolean);
}
