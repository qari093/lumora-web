export function buildContextProfile(input:any){
  return {
    hour: input?.hour ?? 0,
    device: input?.device ?? "web",
    mood: input?.mood ?? "neutral"
  };
}
