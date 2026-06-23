import { useDeferredValue, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockApi } from '@/lib/api/mockApi';
import { formatDateTime } from '@/lib/utils/date';
import {
  normalizeTaskSearch,
  parseTaskStatusFilter,
  taskStatusFilters,
  type TaskStatusFilter,
} from '@/lib/tasks/taskFilters';
import type { TaskStatus } from '@/types/domain';

export function TaskQueuePage() {
  const { i18n, t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = parseTaskStatusFilter(searchParams.get('status'));
  const query = normalizeTaskSearch(searchParams.get('q'));
  const deferredQuery = useDeferredValue(query);

  const tasksQuery = useQuery({
    queryKey: ['tasks', status, deferredQuery],
    queryFn: () => mockApi.getTasks({ status, query: deferredQuery }),
  });
  const allTasksQuery = useQuery({
    queryKey: ['tasks', 'queue-summary'],
    queryFn: () => mockApi.getTasks(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ taskId, nextStatus }: { taskId: string; nextStatus: TaskStatus }) =>
      mockApi.updateTaskStatus(taskId, nextStatus),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const projects = useMemo(() => {
    const unique = new Set(tasksQuery.data?.map((task) => task.projectName) ?? []);
    return [...unique].sort();
  }, [tasksQuery.data]);
  const statusCounts = useMemo(() => {
    const counts = new Map<TaskStatusFilter, number>([['all', allTasksQuery.data?.length ?? 0]]);
    for (const item of allTasksQuery.data ?? []) {
      counts.set(item.status, (counts.get(item.status) ?? 0) + 1);
    }
    return counts;
  }, [allTasksQuery.data]);

  function updateFilters(next: { status?: TaskStatusFilter; query?: string }) {
    const params = new URLSearchParams(searchParams);
    const nextStatus = next.status ?? status;
    const nextQuery = next.query ?? query;

    if (nextStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', nextStatus);
    }

    if (nextQuery.trim()) {
      params.set('q', nextQuery);
    } else {
      params.delete('q');
    }

    setSearchParams(params, { replace: true });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">{t('tasks.title')}</h1>
        <p className="mt-2 text-slate-600">{t('tasks.description')}</p>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('tasks.filterByStatus')}</span>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              value={status}
              onChange={(event) =>
                updateFilters({ status: event.target.value as TaskStatusFilter })
              }
            >
              {taskStatusFilters.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? t('tasks.allStatuses') : t(`status.${item}`)}
                  {statusCounts.has(item) ? ` (${statusCounts.get(item)})` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('tasks.search')}</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={query}
              onChange={(event) => updateFilters({ query: event.target.value })}
              placeholder={t('tasks.searchPlaceholder')}
            />
          </label>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          {t('tasks.projectsSummary', {
            projects: projects.length ? projects.join(', ') : t('tasks.noProjects'),
          })}
        </p>
      </Card>

      <Card className="overflow-hidden p-0">
        {tasksQuery.isLoading ? (
          <p className="p-5 text-slate-600">{t('tasks.loading')}</p>
        ) : tasksQuery.isError ? (
          <div className="space-y-3 p-5">
            <p className="text-red-700">{t('tasks.loadError')}</p>
            <Button type="button" variant="secondary" onClick={() => void tasksQuery.refetch()}>
              {t('common.retry')}
            </Button>
          </div>
        ) : tasksQuery.data?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <caption className="sr-only">{t('tasks.tableCaption')}</caption>
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3">
                    {t('tasks.columnTask')}
                  </th>
                  <th scope="col" className="px-5 py-3">
                    {t('tasks.columnProject')}
                  </th>
                  <th scope="col" className="px-5 py-3">
                    {t('tasks.columnDue')}
                  </th>
                  <th scope="col" className="px-5 py-3">
                    {t('tasks.columnDifficulty')}
                  </th>
                  <th scope="col" className="px-5 py-3">
                    {t('tasks.columnStatus')}
                  </th>
                  <th scope="col" className="px-5 py-3">
                    {t('tasks.columnAction')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {tasksQuery.data.map((task) => (
                  <tr key={task.id}>
                    <td className="max-w-xl px-5 py-4">
                      <p className="font-semibold text-slate-950">{task.id}</p>
                      <p className="mt-1 line-clamp-2 text-slate-600">{task.prompt}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{task.projectName}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {formatDateTime(task.dueAt, i18n.language)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {t(`difficulty.${task.difficulty}`)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/review/${task.id}`}
                          className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                        >
                          {t('tasks.openTask')}
                        </Link>
                        {task.status === 'unassigned' ? (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              statusMutation.mutate({ taskId: task.id, nextStatus: 'in_progress' })
                            }
                            disabled={statusMutation.isPending}
                          >
                            {t('tasks.startTask')}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-5 text-slate-600">{t('tasks.noResults')}</p>
        )}
      </Card>
    </div>
  );
}
