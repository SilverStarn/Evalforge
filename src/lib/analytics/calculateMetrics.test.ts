import { describe, expect, it } from 'vitest';
import { submissions, tasks } from '@/data/seed';
import { calculateDashboardMetrics } from './calculateMetrics';

describe('calculateDashboardMetrics', () => {
  it('calculates core dashboard values from seeded data', () => {
    const metrics = calculateDashboardMetrics(tasks, submissions);

    expect(metrics.totalTasks).toBe(5);
    expect(metrics.completedTasks).toBe(3);
    expect(metrics.needsReview).toBe(1);
    expect(metrics.averageConfidence).toBeGreaterThan(0);
    expect(metrics.tasksByProject.length).toBeGreaterThan(0);
  });
});
