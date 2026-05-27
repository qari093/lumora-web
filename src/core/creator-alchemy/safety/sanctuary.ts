import type { NotificationMode } from "./types";

export interface SanctuaryDay {
  active: boolean;
  notificationMode: NotificationMode;
  algorithmPressureReduced: boolean;
  message: string;
}

export function activateSanctuaryDay(requested: boolean): SanctuaryDay {
  if (!requested) {
    return {
      active: false,
      notificationMode: "normal",
      algorithmPressureReduced: false,
      message: ""
    };
  }

  return {
    active: true,
    notificationMode: "silent",
    algorithmPressureReduced: true,
    message: "You gave yourself a quiet day. That too is part of your art."
  };
}
