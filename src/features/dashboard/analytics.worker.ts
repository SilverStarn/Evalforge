import { calculateDashboardMetrics } from '@/lib/analytics/calculateMetrics';
import type { EvaluationTask, ReviewSubmission } from '@/types/domain';

self.onmessage = (
  event: MessageEvent<{ tasks: EvaluationTask[]; submissions: ReviewSubmission[] }>,
) => {
  const metrics = calculateDashboardMetrics(event.data.tasks, event.data.submissions);
  self.postMessage(metrics);
};

export {};
