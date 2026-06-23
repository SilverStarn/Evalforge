import { useDeferredValue, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockApi } from '@/lib/api/mockApi';
import { formatDateTime } from '@/lib/utils/date';
import {
  normalizeTaskSearch,
  parseTaskStatusFilter,
  taskStatusFilters,
  type TaskStatusFilter,
} from '@/lib/tasks/taskFilters';
import type { EvaluationTask, TaskStatus } from '@/types/domain';

const controlClassName =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-[inset_0_1px_1px_rgb(15_23_42_/_0.04)] transition focus:border-blue-500';

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

  function renderTaskActions(task: EvaluationTask) {
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/review/${task.id}`}
          className="rounded-md border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-[0_1px_1px_rgb(15_23_42_/_0.04)] transition hover:bg-blue-800"
        >
          {t('tasks.openTask')}
        </Link>
        {task.status === 'unassigned' ? (
          <Button
            variant="secondary"
            onClick={() => statusMutation.mutate({ taskId: task.id, nextStatus: 'in_progress' })}
            disabled={statusMutation.isPending}
          >
            {t('tasks.startTask')}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('tasks.title')} description={t('tasks.description')} />

      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('tasks.filterByStatus')}</span>
            <select
              className={controlClassName}
              value={status}
              onChange={(event) =>
                updateFilters({ status: event.target.value as TaskStatusFilter })
              }
            >
              {taskStatusFilters.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? t('tasks.allStatuses') : t(`status.${item}`)}
                  {!allTasksQuery.isLoading && statusCounts.has(item)
                    ? ` (${statusCounts.get(item)})`
                    : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('tasks.search')}</span>
            <span className="relative block">
              <Search
                aria-hidden="true"
                size={17}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className={`${controlClassName} ps-9`}
                value={query}
                onChange={(event) => updateFilters({ query: event.target.value })}
                placeholder={t('tasks.searchPlaceholder')}
              />
            </span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
          {taskStatusFilters
            .filter((item): item is TaskStatus => item !== 'all')
            .map((item) => (
              <div
                key={item}
                className={clsx(
                  'inline-flex min-h-9 items-center gap-2 rounded-md border px-2.5 py-1.5',
                  status === item
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-slate-50 text-slate-600',
                )}
              >
                <StatusBadge status={item} />
                <span className="text-xs font-semibold text-slate-500">
                  {allTasksQuery.isLoading ? '-' : (statusCounts.get(item) ?? 0)}
                </span>
              </div>
            ))}
        </div>

        <p className="text-sm text-slate-500">
          {tasksQuery.isLoading
            ? t('tasks.loading')
            : t('tasks.projectsSummary', {
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
          <>
            <div className="grid gap-3 p-4 md:hidden">
              {tasksQuery.data.map((task) => (
                <article
                  key={task.id}
                  className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">{task.id}</p>
                      <p className="mt-1 font-medium text-slate-950">{task.projectName}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">{task.prompt}</p>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase text-slate-500">
                        {t('tasks.columnDue')}
                      </dt>
                      <dd className="mt-1 text-slate-700">
                        {formatDateTime(task.dueAt, i18n.language)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase text-slate-500">
                        {t('tasks.columnDifficulty')}
                      </dt>
                      <dd className="mt-1 text-slate-700">{t(`difficulty.${task.difficulty}`)}</dd>
                    </div>
                  </dl>
                  {renderTaskActions(task)}
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <caption className="sr-only">{t('tasks.tableCaption')}</caption>
                <thead className="bg-slate-100 text-left text-xs font-semibold uppercase text-slate-600">
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
                    <tr key={task.id} className="transition-colors hover:bg-slate-50">
                      <td className="max-w-xl px-5 py-4 align-top">
                        <p className="text-xs font-semibold uppercase text-slate-500">{task.id}</p>
                        <p className="mt-1 line-clamp-2 text-slate-600">{task.prompt}</p>
                      </td>
                      <td className="px-5 py-4 align-top text-slate-700">{task.projectName}</td>
                      <td className="px-5 py-4 align-top text-slate-700">
                        {formatDateTime(task.dueAt, i18n.language)}
                      </td>
                      <td className="px-5 py-4 align-top text-slate-700">
                        {t(`difficulty.${task.difficulty}`)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-5 py-4 align-top">{renderTaskActions(task)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="p-5 text-slate-600">{t('tasks.noResults')}</p>
        )}
      </Card>
    </div>
  );
}
