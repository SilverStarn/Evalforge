import { describe, expect, it } from 'vitest';
import { buildDashboardCsv } from './dashboardCsv';
import type { DashboardMetrics } from './calculateMetrics';

const metrics: DashboardMetrics = {
  totalTasks: 2,
  completedTasks: 1,
  needsReview: 1,
  approvalRate: 50,
  rejectionRate: 0,
  averageMinutes: 6.5,
  averageConfidence: 84,
  agreementRate: 75,
  tasksByProject: [
    { projectName: 'Browser Concepts', total: 1, completed: 1 },
    { projectName: 'Health, Safety', total: 1, completed: 0 },
  ],
};

describe('buildDashboardCsv', () => {
  it('formats dashboard metrics and escapes project names', () => {
    expect(buildDashboardCsv(metrics)).toContain('Agreement rate,75%');
    expect(buildDashboardCsv(metrics)).toContain('"Health, Safety",1,0');
  });
});
