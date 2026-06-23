import type { TaskStatus } from '@/types/domain';

export const taskStatuses = [
  'unassigned',
  'in_progress',
  'submitted',
  'needs_review',
  'approved',
  'rejected',
] as const satisfies readonly TaskStatus[];

export type TaskStatusFilter = TaskStatus | 'all';

export const taskStatusFilters = ['all', ...taskStatuses] as const;

export function isTaskStatusFilter(value: string): value is TaskStatusFilter {
  return taskStatusFilters.includes(value as TaskStatusFilter);
}

export function parseTaskStatusFilter(value: string | null): TaskStatusFilter {
  return value && isTaskStatusFilter(value) ? value : 'all';
}

export function normalizeTaskSearch(value: string | null) {
  return value?.trim() ?? '';
}
