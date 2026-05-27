export function hydrationTiming(priority: "critical" | "lazy") {
  return {
    priority,
    defer: priority === "lazy"
  };
}
