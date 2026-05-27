export function attachCircleAssignmentToFypItem(item: any, assignment: any) {
  return {
    ...item,
    circleAssignment: {
      assigned: true,
      circleId: assignment.targetCircleId,
      uploadId: assignment.uploadId,
      queuedAt: assignment.queuedAt,
    },
  };
}
