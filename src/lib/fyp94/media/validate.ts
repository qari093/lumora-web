export function validateFyp94Mime(mimeType: string): boolean {
  return mimeType === "video/mp4";
}

export function validateFyp94Duration(seconds: number): boolean {
  return Number.isFinite(seconds) && seconds >= 7 && seconds <= 45;
}

export function detectFyp94AspectRatio(width: number, height: number): "vertical" | "square" | "horizontal" {
  if (height > width) return "vertical";
  if (width === height) return "square";
  return "horizontal";
}

export function validateFyp94AspectRatio(width: number, height: number): boolean {
  return detectFyp94AspectRatio(width, height) === "vertical";
}
