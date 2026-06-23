import { describe, expect, it } from 'vitest';
import { rubrics } from '@/data/seed';
import { rubricSchema } from './rubricSchema';

describe('rubricSchema', () => {
  it('accepts seeded rubrics', () => {
    for (const rubric of rubrics) {
      expect(rubricSchema.safeParse(rubric).success).toBe(true);
    }
  });

  it('rejects a rating criterion without min and max', () => {
    const invalid = structuredClone(rubrics[0]);
    invalid.criteria[0] = { ...invalid.criteria[0], min: undefined, max: undefined };

    expect(rubricSchema.safeParse(invalid).success).toBe(false);
  });
});
