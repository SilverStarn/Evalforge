import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { mockApi } from '@/lib/api/mockApi';
import { calculateDashboardMetrics, type DashboardMetrics } from '@/lib/analytics/calculateMetrics';
import { buildDashboardCsv } from '@/lib/analytics/dashboardCsv';

export function DashboardPage() {
  const { t } = useTranslation();
  const tasksQuery = useQuery({
    queryKey: ['tasks', 'dashboard'],
    queryFn: () => mockApi.getTasks(),
  });
  const submissionsQuery = useQuery({
    queryKey: ['submissions'],
    queryFn: () => mockApi.getSubmissions(),
  });
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    if (!tasksQuery.data || !submissionsQuery.data) return;

    try {
      const worker = new Worker(new URL('./analytics.worker.ts', import.meta.url), {
        type: 'module',
      });
      worker.onmessage = (event: MessageEvent<DashboardMetrics>) => setMetrics(event.data);
      worker.onerror = () => {
        setMetrics(calculateDashboardMetrics(tasksQuery.data, submissionsQuery.data));
        worker.terminate();
      };
      worker.postMessage({ tasks: tasksQuery.data, submissions: submissionsQuery.data });
      return () => worker.terminate();
    } catch {
      setMetrics(calculateDashboardMetrics(tasksQuery.data, submissionsQuery.data));
    }
  }, [tasksQuery.data, submissionsQuery.data]);

  function downloadCsv() {
    if (!metrics) return;
    const blob = new Blob([buildDashboardCsv(metrics)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'evalforge-dashboard.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  if (tasksQuery.isLoading || submissionsQuery.isLoading || !metrics) {
    return <Card>{t('dashboard.loading')}</Card>;
  }

  if (tasksQuery.isError || submissionsQuery.isError) {
    return (
      <Card className="space-y-3">
        <p className="text-red-700">{t('dashboard.loadError')}</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            void tasksQuery.refetch();
            void submissionsQuery.refetch();
          }}
        >
          {t('common.retry')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.description')}
        actions={
          <Button type="button" variant="secondary" onClick={downloadCsv}>
            <Download size={17} aria-hidden="true" />
            {t('dashboard.exportCsv')}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          className="border-l-4 border-l-slate-400"
          label={t('dashboard.totalTasks')}
          value={metrics.totalTasks}
        />
        <MetricCard
          className="border-l-4 border-l-blue-500"
          label={t('dashboard.completedTasks')}
          value={metrics.completedTasks}
        />
        <MetricCard
          className="border-l-4 border-l-violet-500"
          label={t('dashboard.needsReview')}
          value={metrics.needsReview}
        />
        <MetricCard
          className="border-l-4 border-l-emerald-500"
          label={t('dashboard.agreementRate')}
          value={`${metrics.agreementRate}%`}
        />
        <MetricCard
          className="border-l-4 border-l-amber-500"
          label={t('dashboard.averageConfidence')}
          value={`${metrics.averageConfidence}%`}
        />
        <MetricCard
          className="border-l-4 border-l-slate-500"
          label={t('dashboard.averageMinutes')}
          value={metrics.averageMinutes}
          detail={t('dashboard.averageMinutesDetail')}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-950">{t('dashboard.tasksByProject')}</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <caption className="sr-only">{t('dashboard.projectTableCaption')}</caption>
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3">
                  {t('dashboard.columnProject')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('dashboard.columnTotal')}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t('dashboard.columnCompleted')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.tasksByProject.map((project) => (
                <tr key={project.projectName} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-950">{project.projectName}</td>
                  <td className="px-4 py-3 text-slate-700">{project.total}</td>
                  <td className="px-4 py-3 text-slate-700">{project.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
