import { describe, expect, it } from 'vitest';
import { leadDecisions, rubrics, submissions, tasks } from '@/data/seed';
import { mockDataSchema } from './domainSchemas';

describe('mock API data schemas', () => {
  it('accepts the seeded mock data used by the API boundary', () => {
    expect(
      mockDataSchema.safeParse({
        tasks,
        rubrics,
        submissions,
        leadDecisions,
      }).success,
    ).toBe(true);
  });
});
