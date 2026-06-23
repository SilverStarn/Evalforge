import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockApi } from '@/lib/api/mockApi';
import type { LeadDecision, ReviewDecision } from '@/types/domain';

export function LeadReviewPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState<ReviewDecision>('A');
  const [note, setNote] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  const tasksQuery = useQuery({
    queryKey: ['tasks', 'needs-review'],
    queryFn: () => mockApi.getTasks({ status: 'needs_review' }),
  });
  const submissionsQuery = useQuery({
    queryKey: ['submissions'],
    queryFn: () => mockApi.getSubmissions(),
  });

  const activeTask = useMemo(
    () => tasksQuery.data?.find((task) => task.id === selectedTaskId) ?? tasksQuery.data?.[0],
    [selectedTaskId, tasksQuery.data],
  );
  const activeSubmissions = useMemo(
    () => submissionsQuery.data?.filter((submission) => submission.taskId === activeTask?.id) ?? [],
    [activeTask?.id, submissionsQuery.data],
  );
  const decisionSummary = useMemo(
    () =>
      activeSubmissions.reduce<Record<ReviewDecision, number>>(
        (counts, submission) => {
          counts[submission.decision] += 1;
          return counts;
        },
        { A: 0, B: 0, Tie: 0 },
      ),
    [activeSubmissions],
  );

  const mutation = useMutation({
    mutationFn: (leadDecision: LeadDecision) => mockApi.saveLeadDecision(leadDecision),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['tasks', 'needs-review'] });
      setNote('');
    },
  });

  function submitDecision() {
    if (!activeTask || !note.trim()) return;
    mutation.mutate({
      id: `ld-${crypto.randomUUID()}`,
      taskId: activeTask.id,
      leadName: 'Current lead',
      decision,
      note,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">{t('leadReview.title')}</h1>
        <p className="mt-2 text-slate-600">{t('leadReview.description')}</p>
      </div>

      {tasksQuery.isLoading || submissionsQuery.isLoading ? (
        <Card>{t('leadReview.loading')}</Card>
      ) : null}
      {tasksQuery.isError || submissionsQuery.isError ? (
        <Card className="space-y-3">
          <p className="text-red-700">{t('leadReview.loadError')}</p>
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
      ) : null}

      {!activeTask && !tasksQuery.isLoading ? <Card>{t('leadReview.empty')}</Card> : null}

      {activeTask ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <Card className="space-y-5">
            {tasksQuery.data && tasksQuery.data.length > 1 ? (
              <label className="block max-w-md space-y-2 text-sm font-medium text-slate-700">
                <span>{t('leadReview.taskSelector')}</span>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={activeTask.id}
                  onChange={(event) => setSelectedTaskId(event.target.value)}
                >
                  {tasksQuery.data.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.id} · {task.projectName}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div>
              <p className="text-sm font-semibold uppercase text-blue-700">{activeTask.id}</p>
              <h2 className="text-2xl font-semibold text-slate-950">
                {t('leadReview.disagreement')}
              </h2>
              <p className="mt-2 text-slate-600">{activeTask.prompt}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-950">{t('review.responseA')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{activeTask.responseA}</p>
              </section>
              <section className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-950">{t('review.responseB')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{activeTask.responseB}</p>
              </section>
            </div>

            <section>
              <h3 className="font-semibold text-slate-950">
                {t('leadReview.reviewerSubmissions')}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {t('leadReview.decisionSummary', decisionSummary)}
              </p>
              <div className="mt-3 space-y-3">
                {activeSubmissions.map((submission) => (
                  <article key={submission.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="font-semibold text-slate-950">
                      {t('leadReview.submissionSummary', {
                        reviewer: submission.reviewerName,
                        decision: submission.decision,
                        confidence: submission.confidence,
                      })}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {typeof submission.scores.rationale === 'string'
                        ? submission.scores.rationale
                        : t('leadReview.noRationale')}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </Card>

          <Card className="space-y-4">
            <fieldset className="space-y-3">
              <legend className="font-semibold text-slate-950">
                {t('leadReview.finalDecision')}
              </legend>
              <div className="flex flex-wrap gap-2">
                {(['A', 'B', 'Tie'] as const).map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={decision === item ? 'primary' : 'secondary'}
                    onClick={() => setDecision(item)}
                    aria-pressed={decision === item}
                    aria-label={
                      item === 'Tie'
                        ? t('review.chooseTie')
                        : t('review.chooseResponse', { decision: item })
                    }
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </fieldset>
            <label className="block space-y-2 text-sm font-semibold text-slate-900">
              <span>{t('leadReview.note')}</span>
              <textarea
                className="min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-800"
                value={note}
                aria-describedby={!note.trim() ? 'lead-note-error' : undefined}
                onChange={(event) => setNote(event.target.value)}
              />
              {!note.trim() ? (
                <span id="lead-note-error" className="block text-sm font-normal text-red-700">
                  {t('leadReview.noteRequired')}
                </span>
              ) : null}
            </label>
            {mutation.isError ? (
              <p className="text-sm text-red-700">{t('leadReview.submitError')}</p>
            ) : null}
            <Button
              type="button"
              disabled={!note.trim() || mutation.isPending}
              onClick={submitDecision}
            >
              {mutation.isPending ? t('leadReview.saving') : t('leadReview.approve')}
            </Button>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
