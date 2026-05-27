export function routeOwnershipMap(route: string) {
  if (route.startsWith("/api/fyp") || route.startsWith("/fyp")) return "discovery";
  if (route.startsWith("/api/live") || route.startsWith("/live")) return "realtime";
  if (route.startsWith("/api/gmar") || route.startsWith("/gmar")) return "games";
  if (route.startsWith("/api/nexa") || route.startsWith("/nexa")) return "wellbeing";
  if (route.startsWith("/api/zendoro") || route.startsWith("/zendoro")) return "commerce";
  if (route.startsWith("/api/zencoin") || route.startsWith("/wallet")) return "economy";
  return "platform";
}
