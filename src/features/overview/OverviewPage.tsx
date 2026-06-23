import { useMemo } from 'react';
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  GitPullRequestDraft,
  Languages,
  ListChecks,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockApi } from '@/lib/api/mockApi';
import { formatDateTime } from '@/lib/utils/date';
import type { TaskStatus } from '@/types/domain';

const cards = [
  {
    to: '/review/t-1001',
    icon: ClipboardCheck,
    titleKey: 'overview.reviewTitle',
    textKey: 'overview.reviewText',
    iconClass: 'bg-blue-50 text-blue-700',
    accentClass: 'border-t-blue-500',
  },
  {
    to: '/lead-review',
    icon: GitPullRequestDraft,
    titleKey: 'overview.leadTitle',
    textKey: 'overview.leadText',
    iconClass: 'bg-violet-50 text-violet-700',
    accentClass: 'border-t-violet-500',
  },
  {
    to: '/dashboard',
    icon: BarChart3,
    titleKey: 'overview.analyticsTitle',
    textKey: 'overview.analyticsText',
    iconClass: 'bg-emerald-50 text-emerald-700',
    accentClass: 'border-t-emerald-500',
  },
  {
    to: '/settings',
    icon: Languages,
    titleKey: 'overview.localizationTitle',
    textKey: 'overview.localizationText',
    iconClass: 'bg-slate-100 text-slate-700',
    accentClass: 'border-t-slate-400',
  },
];

export function OverviewPage() {
  const { i18n, t } = useTranslation();
  const tasksQuery = useQuery({
    queryKey: ['tasks', 'overview'],
    queryFn: () => mockApi.getTasks(),
  });

  const statusCounts = useMemo(() => {
    const counts = new Map<TaskStatus, number>();
    for (const task of tasksQuery.data ?? []) {
      counts.set(task.status, (counts.get(task.status) ?? 0) + 1);
    }
    return counts;
  }, [tasksQuery.data]);
  const activeProjects = useMemo(
    () => new Set(tasksQuery.data?.map((task) => task.projectName) ?? []).size,
    [tasksQuery.data],
  );
  const nextTask = useMemo(
    () =>
      tasksQuery.data?.find((task) => task.status === 'in_progress') ??
      tasksQuery.data?.find((task) => task.status === 'unassigned') ??
      tasksQuery.data?.[0],
    [tasksQuery.data],
  );
  const metricValue = (value: number) => (tasksQuery.isLoading ? '-' : value);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="EvalForge"
        title={t('overview.title')}
        description={t('overview.intro')}
        actions={
          <>
            <Link
              to="/review/t-1001"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_1px_rgb(15_23_42_/_0.04)] transition-[background-color,transform] hover:bg-blue-800 motion-safe:hover:-translate-y-px"
            >
              {t('overview.openSampleTask')}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              to="/tasks"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_1px_1px_rgb(15_23_42_/_0.04)] transition-[border-color,background-color,transform] hover:border-slate-400 hover:bg-slate-50 motion-safe:hover:-translate-y-px"
            >
              <ListChecks size={17} aria-hidden="true" />
              {t('overview.openQueue')}
            </Link>
          </>
        }
      />

      <section className="grid items-start gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="grid auto-rows-min gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="space-y-2 border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-slate-500">{t('overview.totalTasks')}</p>
            <p className="text-3xl font-semibold text-slate-950">
              {metricValue(tasksQuery.data?.length ?? 0)}
            </p>
          </Card>
          <Card className="space-y-2 border-l-4 border-l-violet-500">
            <p className="text-sm font-medium text-slate-500">{t('overview.leadQueue')}</p>
            <p className="text-3xl font-semibold text-slate-950">
              {metricValue(statusCounts.get('needs_review') ?? 0)}
            </p>
          </Card>
          <Card className="space-y-2 border-l-4 border-l-emerald-500">
            <p className="text-sm font-medium text-slate-500">{t('overview.approved')}</p>
            <p className="text-3xl font-semibold text-slate-950">
              {metricValue(statusCounts.get('approved') ?? 0)}
            </p>
          </Card>
          <Card className="space-y-2 border-l-4 border-l-slate-400">
            <p className="text-sm font-medium text-slate-500">{t('overview.activeProjects')}</p>
            <p className="text-3xl font-semibold text-slate-950">{metricValue(activeProjects)}</p>
          </Card>
        </div>

        <Card className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">{t('overview.queueTitle')}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {t('overview.queueDescription')}
            </p>
          </div>

          {tasksQuery.isLoading ? (
            <p className="text-sm text-slate-600">{t('overview.queueLoading')}</p>
          ) : tasksQuery.isError ? (
            <div className="space-y-3">
              <p className="text-sm text-red-700">{t('overview.queueError')}</p>
              <Button type="button" variant="secondary" onClick={() => void tasksQuery.refetch()}>
                {t('common.retry')}
              </Button>
            </div>
          ) : nextTask ? (
            <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-950">{nextTask.id}</p>
                <StatusBadge status={nextTask.status} />
              </div>
              <p className="line-clamp-2 text-sm leading-6 text-slate-700">{nextTask.prompt}</p>
              <p className="text-xs text-slate-500">
                {t('overview.due')}: {formatDateTime(nextTask.dueAt, i18n.language)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">{t('overview.noActiveTask')}</p>
          )}
        </Card>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.to} interactive className={`border-t-4 ${card.accentClass} p-0`}>
              <Link
                to={card.to}
                className="block h-full rounded-lg p-5 focus-visible:outline-offset-[-2px]"
              >
                <span
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold text-slate-950">{t(card.titleKey)}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t(card.textKey)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  {t('overview.open')}
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
