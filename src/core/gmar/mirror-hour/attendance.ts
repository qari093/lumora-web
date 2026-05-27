export type MirrorAttendanceState = {
  attendanceCount: number;
  lonelinessProtectionActive: boolean;
};

export function createMirrorAttendanceState(
  attendanceCount = 0,
): MirrorAttendanceState {
  return {
    attendanceCount,
    lonelinessProtectionActive: attendanceCount <= 0,
  };
}
