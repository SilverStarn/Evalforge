import { describe, expect, it } from 'vitest';
import { buildReviewSubmission, compactScores } from './reviewDraft';

describe('reviewDraft helpers', () => {
  it('removes undefined scores without dropping false boolean scores', () => {
    expect(
      compactScores({
        accuracy: 5,
        safety: false,
        missing: undefined,
      }),
    ).toEqual({
      accuracy: 5,
      safety: false,
    });
  });

  it('builds deterministic review submissions when options are supplied', () => {
    const submission = buildReviewSubmission(
      't-1',
      {
        decision: 'A',
        confidence: 88,
        scores: { rationale: 'A is clearer.' },
        annotations: [],
      },
      {
        id: 's-test',
        minutesSpent: 4,
        submittedAt: '2026-06-23T12:00:00Z',
      },
    );

    expect(submission).toMatchObject({
      id: 's-test',
      taskId: 't-1',
      decision: 'A',
      confidence: 88,
      minutesSpent: 4,
      submittedAt: '2026-06-23T12:00:00Z',
      status: 'submitted',
    });
  });
});
