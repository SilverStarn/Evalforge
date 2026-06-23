import type { EvaluationTask, ReviewSubmission } from '@/types/domain';

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  needsReview: number;
  approvalRate: number;
  rejectionRate: number;
  averageMinutes: number;
  averageConfidence: number;
  agreementRate: number;
  tasksByProject: Array<{ projectName: string; total: number; completed: number }>;
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function isReviewerComplete(status: EvaluationTask['status']) {
  return ['submitted', 'needs_review', 'approved', 'rejected'].includes(status);
}

export function calculateDashboardMetrics(
  tasks: EvaluationTask[],
  submissions: ReviewSubmission[],
): DashboardMetrics {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => isReviewerComplete(task.status)).length;
  const needsReview = tasks.filter((task) => task.status === 'needs_review').length;
  const approved = tasks.filter((task) => task.status === 'approved').length;
  const rejectedSubmissions = submissions.filter(
    (submission) => submission.status === 'rejected',
  ).length;
  const averageMinutes = submissions.length
    ? round(
        submissions.reduce((sum, submission) => sum + submission.minutesSpent, 0) /
          submissions.length,
      )
    : 0;
  const averageConfidence = submissions.length
    ? round(
        submissions.reduce((sum, submission) => sum + submission.confidence, 0) /
          submissions.length,
      )
    : 0;

  const submissionsByTask = new Map<string, ReviewSubmission[]>();
  for (const submission of submissions) {
    const list = submissionsByTask.get(submission.taskId) ?? [];
    list.push(submission);
    submissionsByTask.set(submission.taskId, list);
  }

  let comparableTasks = 0;
  let agreedTasks = 0;
  submissionsByTask.forEach((taskSubmissions) => {
    if (taskSubmissions.length < 2) return;
    comparableTasks += 1;
    const [first] = taskSubmissions;
    if (taskSubmissions.every((submission) => submission.decision === first.decision)) {
      agreedTasks += 1;
    }
  });

  const projectMap = new Map<string, { projectName: string; total: number; completed: number }>();
  for (const task of tasks) {
    const existing = projectMap.get(task.projectId) ?? {
      projectName: task.projectName,
      total: 0,
      completed: 0,
    };
    existing.total += 1;
    if (isReviewerComplete(task.status)) {
      existing.completed += 1;
    }
    projectMap.set(task.projectId, existing);
  }

  return {
    totalTasks,
    completedTasks,
    needsReview,
    approvalRate: totalTasks ? round((approved / totalTasks) * 100) : 0,
    rejectionRate: submissions.length ? round((rejectedSubmissions / submissions.length) * 100) : 0,
    averageMinutes,
    averageConfidence,
    agreementRate: comparableTasks ? round((agreedTasks / comparableTasks) * 100) : 0,
    tasksByProject: [...projectMap.values()],
  };
}
