export type ReviewRationaleDecision =
  | "allow"
  | "deprioritize"
  | "metadata-only"
  | "region-restrict"
  | "manual-review"
  | "suppress";

export type ReviewNoteRecord = {
  id: string;
  entityId: string;
  reviewerId: string;
  decision: ReviewRationaleDecision;
  rationale: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export function createReviewNoteRecord(
  input: Omit<ReviewNoteRecord, "id">
): ReviewNoteRecord {
  return {
    id: [
      input.entityId.trim(),
      input.reviewerId.trim(),
      Date.parse(input.createdAt || new Date().toISOString()),
    ].join(":"),
    entityId: input.entityId.trim(),
    reviewerId: input.reviewerId.trim(),
    decision: input.decision,
    rationale: input.rationale.trim(),
    notes: input.notes?.trim(),
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}

export function appendReviewNoteRationale(
  record: ReviewNoteRecord,
  extraNotes: string
): ReviewNoteRecord {
  const mergedNotes = [record.notes, extraNotes.trim()].filter(Boolean).join("\n");
  return {
    ...record,
    notes: mergedNotes,
    updatedAt: new Date().toISOString(),
  };
}

export function hasReviewRationale(record: ReviewNoteRecord): boolean {
  return record.rationale.trim().length > 0;
}
