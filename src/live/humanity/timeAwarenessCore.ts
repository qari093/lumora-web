export type TimeAwarenessNotice = {
  shouldShow: boolean;
  message: string;
};

export function getTimeAwarenessNotice(minutesInLive: number): TimeAwarenessNotice {
  if (minutesInLive < 90) {
    return { shouldShow: false, message: "" };
  }

  return {
    shouldShow: true,
    message: "You’ve been here a while. The world outside is still beautiful.",
  };
}
