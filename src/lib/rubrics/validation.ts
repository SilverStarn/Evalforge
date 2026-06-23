import type { ReviewDecision, Rubric, RubricScoreValue } from '@/types/domain';

export type ReviewValidationError =
  | { code: 'decision_required' }
  | { code: 'confidence_range' }
  | { code: 'criterion_required'; label: string };

export interface ReviewDraftValues {
  decision?: ReviewDecision;
  confidence: number;
  scores: Record<string, RubricScoreValue | undefined>;
}

export interface ReviewValidationResult {
  valid: boolean;
  errors: Record<string, ReviewValidationError>;
}

export function validateReviewDraft(
  rubric: Rubric,
  draft: ReviewDraftValues,
): ReviewValidationResult {
  const errors: Record<string, ReviewValidationError> = {};

  if (!draft.decision) {
    errors.decision = { code: 'decision_required' };
  }

  if (draft.confidence < 0 || draft.confidence > 100) {
    errors.confidence = { code: 'confidence_range' };
  }

  for (const criterion of rubric.criteria) {
    if (!criterion.required) continue;

    const value = draft.scores[criterion.id];
    const missing =
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (criterion.type === 'free_text' && typeof value === 'string' && value.trim().length === 0);

    if (missing) {
      errors[criterion.id] = { code: 'criterion_required', label: criterion.label };
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
