import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { mockApi } from '@/lib/api/mockApi';
import { ReviewWorkspace } from './ReviewWorkspace';

export function ReviewPage() {
  const { t } = useTranslation();
  const { taskId = '' } = useParams();

  const taskQuery = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => mockApi.getTask(taskId),
    enabled: Boolean(taskId),
  });

  const rubricQuery = useQuery({
    queryKey: ['rubric', taskQuery.data?.rubricId],
    queryFn: () => mockApi.getRubric(taskQuery.data!.rubricId),
    enabled: Boolean(taskQuery.data?.rubricId),
  });

  if (taskQuery.isLoading || rubricQuery.isLoading) {
    return <Card>{t('review.loading')}</Card>;
  }

  if (taskQuery.isError || rubricQuery.isError || !taskQuery.data || !rubricQuery.data) {
    return (
      <Card className="space-y-3">
        <p className="text-red-700">{t('review.loadError')}</p>
        <Link
          to="/tasks"
          className="inline-flex text-sm font-semibold text-blue-700 hover:underline"
        >
          {t('review.backToQueue')}
        </Link>
      </Card>
    );
  }

  return <ReviewWorkspace task={taskQuery.data} rubric={rubricQuery.data} />;
}
