import type {
  FypGestureIntent
} from "./types";

export function resolveGestureIntent(input: {
  axis: "x" | "y";
  direction: "up" | "down" | "left" | "right";
  force: number;
}): FypGestureIntent {
  if (input.force >= 80 && input.direction === "up") {
    return "pulse";
  }

  if (input.axis === "y" && input.direction === "up") {
    return "next";
  }

  if (input.axis === "y" && input.direction === "down") {
    return "previous";
  }

  if (input.axis === "x" && input.direction === "right") {
    return "open-resonance";
  }

  if (input.axis === "x" && input.direction === "left") {
    return "share";
  }

  return "save";
}
