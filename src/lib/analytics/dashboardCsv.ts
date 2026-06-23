import type { DashboardMetrics } from './calculateMetrics';

function escapeCsvValue(value: string | number) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildDashboardCsv(metrics: DashboardMetrics) {
  const rows: Array<Array<string | number>> = [
    ['Metric', 'Value'],
    ['Total tasks', metrics.totalTasks],
    ['Completed tasks', metrics.completedTasks],
    ['Needs review', metrics.needsReview],
    ['Agreement rate', `${metrics.agreementRate}%`],
    ['Average confidence', `${metrics.averageConfidence}%`],
    ['Average minutes', metrics.averageMinutes],
    [],
    ['Project', 'Total', 'Completed'],
    ...metrics.tasksByProject.map((project) => [
      project.projectName,
      project.total,
      project.completed,
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');
}
