import type {
  Annotation,
  ReviewDecision,
  ReviewSubmission,
  RubricScoreValue,
} from '@/types/domain';

export interface ReviewDraft {
  decision?: ReviewDecision;
  confidence: number;
  scores: Record<string, RubricScoreValue | undefined>;
  annotations: Annotation[];
}

export const initialReviewDraft: ReviewDraft = {
  confidence: 80,
  scores: {},
  annotations: [],
};

export function compactScores(scores: ReviewDraft['scores']): Record<string, RubricScoreValue> {
  return Object.entries(scores).reduce<Record<string, RubricScoreValue>>(
    (compact, [key, value]) => {
      if (value !== undefined) {
        compact[key] = value;
      }

      return compact;
    },
    {},
  );
}

interface BuildReviewSubmissionOptions {
  id?: string;
  submittedAt?: string;
  minutesSpent?: number;
}

export function buildReviewSubmission(
  taskId: string,
  draft: ReviewDraft,
  options: BuildReviewSubmissionOptions = {},
): ReviewSubmission {
  return {
    id: options.id ?? `s-${crypto.randomUUID()}`,
    taskId,
    reviewerId: 'current-user',
    reviewerName: 'Current reviewer',
    decision: draft.decision ?? 'Tie',
    confidence: draft.confidence,
    scores: compactScores(draft.scores),
    annotations: draft.annotations,
    minutesSpent: options.minutesSpent ?? 7,
    submittedAt: options.submittedAt ?? new Date().toISOString(),
    status: 'submitted',
  };
}

export function getNumberScore(
  scores: ReviewDraft['scores'],
  criterionId: string,
): number | undefined {
  const value = scores[criterionId];
  return typeof value === 'number' ? value : undefined;
}

export function getTextScore(scores: ReviewDraft['scores'], criterionId: string) {
  const value = scores[criterionId];
  return typeof value === 'string' ? value : '';
}

export function getStringArrayScore(scores: ReviewDraft['scores'], criterionId: string): string[] {
  const value = scores[criterionId];
  return Array.isArray(value) ? value : [];
}
