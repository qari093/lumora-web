export interface PostRuntime {
  id: string;
  creatorId: string;
  title: string;
  visibility: "free" | "premium" | "draft";
}
