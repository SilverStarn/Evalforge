import { describe, expect, it } from 'vitest';
import { rubrics } from '@/data/seed';
import { validateReviewDraft } from './validation';

describe('validateReviewDraft', () => {
  it('requires decision and required rubric criteria', () => {
    const result = validateReviewDraft(rubrics[0], { confidence: 80, scores: {} });

    expect(result.valid).toBe(false);
    expect(result.errors.decision).toEqual({ code: 'decision_required' });
    expect(result.errors.accuracy).toEqual({
      code: 'criterion_required',
      label: 'Factual accuracy',
    });
  });

  it('accepts a complete answer-quality draft', () => {
    const result = validateReviewDraft(rubrics[0], {
      decision: 'A',
      confidence: 85,
      scores: {
        accuracy: 5,
        completeness: 4,
        clarity: 4,
        safety: true,
        rationale: 'Response A is more accurate and safer.',
      },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
