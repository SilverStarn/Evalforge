import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockApi } from '@/lib/api/mockApi';
import { validateReviewDraft } from '@/lib/rubrics/validation';
import { setActiveDraftTaskId } from '@/store/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type {
  Annotation,
  AnnotationSeverity,
  EvaluationTask,
  ResponseSide,
  ReviewSubmission,
  Rubric,
  RubricScoreValue,
} from '@/types/domain';
import { ResponsePanel } from './ResponsePanel';
import { RubricScoringForm } from './RubricScoringForm';
import { buildReviewSubmission, initialReviewDraft, type ReviewDraft } from './reviewDraft';
import { getReviewValidationMessage } from './validationMessages';
import { useDraftPersistence } from './useDraftPersistence';

interface ReviewWorkspaceProps {
  task: EvaluationTask;
  rubric: Rubric;
}

function getSelectedText() {
  return window.getSelection()?.toString().trim() ?? '';
}

export function ReviewWorkspace({ task, rubric }: ReviewWorkspaceProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const keyboardMode = useAppSelector((state) => state.ui.keyboardMode);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useDraftPersistence<ReviewDraft>(
    `evalforge:draft:${task.id}`,
    initialReviewDraft,
  );
  const [annotationSide, setAnnotationSide] = useState<ResponseSide>('A');
  const [annotationQuote, setAnnotationQuote] = useState('');
  const [annotationNote, setAnnotationNote] = useState('');
  const [annotationSeverity, setAnnotationSeverity] = useState<AnnotationSeverity>('medium');
  const [liveMessage, setLiveMessage] = useState(t('review.draftSaved'));

  const validation = useMemo(() => validateReviewDraft(rubric, draft), [draft, rubric]);
  const annotationsBySide = useMemo(
    () => ({
      A: draft.annotations.filter((annotation) => annotation.response === 'A'),
      B: draft.annotations.filter((annotation) => annotation.response === 'B'),
    }),
    [draft.annotations],
  );
  const getValidationMessage = useCallback(
    (error: Parameters<typeof getReviewValidationMessage>[0]) =>
      getReviewValidationMessage(error, t),
    [t],
  );

  const submitMutation = useMutation({
    mutationFn: (submission: ReviewSubmission) => mockApi.submitReview(submission),
    onSuccess: async () => {
      window.localStorage.removeItem(`evalforge:draft:${task.id}`);
      setLiveMessage(t('review.submitted'));
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    },
  });

  useEffect(() => {
    dispatch(setActiveDraftTaskId(task.id));
    return () => {
      dispatch(setActiveDraftTaskId(undefined));
    };
  }, [dispatch, task.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!keyboardMode) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
        return;
      if (event.key.toLowerCase() === 'a') {
        setDraft((current) => ({ ...current, decision: 'A' }));
      }
      if (event.key.toLowerCase() === 'b') {
        setDraft((current) => ({ ...current, decision: 'B' }));
      }
      if (event.key.toLowerCase() === 't') {
        setDraft((current) => ({ ...current, decision: 'Tie' }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardMode, setDraft]);

  const updateScore = useCallback(
    (id: string, value: RubricScoreValue) => {
      setDraft((current) => ({
        ...current,
        scores: {
          ...current.scores,
          [id]: value,
        },
      }));
    },
    [setDraft],
  );

  const captureSelection = useCallback((side: ResponseSide) => {
    const selected = getSelectedText();
    if (!selected) return;
    setAnnotationSide(side);
    setAnnotationQuote(selected);
  }, []);

  function addAnnotation() {
    if (!annotationQuote.trim() || !annotationNote.trim()) return;
    const annotation: Annotation = {
      id: `a-${crypto.randomUUID()}`,
      response: annotationSide,
      quote: annotationQuote.trim(),
      note: annotationNote.trim(),
      severity: annotationSeverity,
    };

    setDraft((current) => ({ ...current, annotations: [...current.annotations, annotation] }));
    setAnnotationQuote('');
    setAnnotationNote('');
    setLiveMessage(t('review.draftSaved'));
  }

  function removeAnnotation(annotationId: string) {
    setDraft((current) => ({
      ...current,
      annotations: current.annotations.filter((annotation) => annotation.id !== annotationId),
    }));
  }

  function submitReview() {
    const result = validateReviewDraft(rubric, draft);
    if (!result.valid) return;
    submitMutation.mutate(buildReviewSubmission(task.id, draft));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-700">{task.id}</p>
          <h1 className="text-3xl font-bold text-slate-950">{t('review.title')}</h1>
          <p className="mt-2 text-slate-600">{task.projectName}</p>
        </div>
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
          {t('review.keyboardHint')}
        </p>
      </div>

      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">{t('review.prompt')}</h2>
        <p className="mt-3 leading-7 text-slate-700">{task.prompt}</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <ResponsePanel
          side="A"
          title={t('review.responseA')}
          response={task.responseA}
          annotations={annotationsBySide.A}
          onCaptureSelection={captureSelection}
        />
        <ResponsePanel
          side="B"
          title={t('review.responseB')}
          response={task.responseB}
          annotations={annotationsBySide.B}
          onCaptureSelection={captureSelection}
        />
      </div>

      <Card className="space-y-5">
        <fieldset
          className="space-y-3"
          aria-describedby={validation.errors.decision ? 'decision-error' : undefined}
        >
          <legend className="text-lg font-semibold text-slate-950">
            {t('review.chooseWinner')}
          </legend>
          <div className="flex flex-wrap gap-2">
            {(['A', 'B', 'Tie'] as const).map((decision) => (
              <Button
                key={decision}
                type="button"
                variant={draft.decision === decision ? 'primary' : 'secondary'}
                onClick={() => setDraft((current) => ({ ...current, decision }))}
                aria-pressed={draft.decision === decision}
                aria-label={
                  decision === 'Tie'
                    ? t('review.chooseTie')
                    : t('review.chooseResponse', { decision })
                }
              >
                {decision}
              </Button>
            ))}
          </div>
          {validation.errors.decision ? (
            <p id="decision-error" className="text-sm text-red-700">
              {getValidationMessage(validation.errors.decision)}
            </p>
          ) : null}
        </fieldset>

        <label className="block space-y-2 text-sm font-semibold text-slate-900">
          <span>
            {t('review.confidence')}: {draft.confidence}%
          </span>
          <input
            className="w-full accent-blue-700"
            type="range"
            min="0"
            max="100"
            value={draft.confidence}
            onChange={(event) =>
              setDraft((current) => ({ ...current, confidence: Number(event.target.value) }))
            }
          />
        </label>

        <RubricScoringForm
          rubric={rubric}
          scores={draft.scores}
          errors={validation.errors}
          getErrorMessage={getValidationMessage}
          onScoreChange={updateScore}
        />
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-950">{t('review.annotations')}</h2>
        <div className="grid gap-4 lg:grid-cols-[140px_1fr_1fr_160px_auto]">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('review.annotationResponse')}</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={annotationSide}
              onChange={(event) => setAnnotationSide(event.target.value as ResponseSide)}
            >
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('review.selectedQuote')}</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={annotationQuote}
              onChange={(event) => setAnnotationQuote(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('review.note')}</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={annotationNote}
              onChange={(event) => setAnnotationNote(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>{t('review.severity')}</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={annotationSeverity}
              onChange={(event) => setAnnotationSeverity(event.target.value as AnnotationSeverity)}
            >
              <option value="low">{t('review.severityLow')}</option>
              <option value="medium">{t('review.severityMedium')}</option>
              <option value="high">{t('review.severityHigh')}</option>
            </select>
          </label>
          <div className="flex items-end">
            <Button type="button" variant="secondary" onClick={addAnnotation}>
              {t('review.addAnnotation')}
            </Button>
          </div>
        </div>

        {draft.annotations.length ? (
          <ul className="space-y-3">
            {draft.annotations.map((annotation) => (
              <li key={annotation.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-semibold text-slate-950">
                    {t('review.annotationSummary', {
                      response: annotation.response,
                      severity: t(
                        `review.severity${annotation.severity[0].toUpperCase()}${annotation.severity.slice(1)}`,
                      ),
                    })}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-2 py-1"
                    onClick={() => removeAnnotation(annotation.id)}
                    aria-label={t('review.removeAnnotation')}
                  >
                    {t('review.remove')}
                  </Button>
                </div>
                <blockquote className="mt-2 border-s-4 border-slate-300 ps-3 text-slate-700">
                  {annotation.quote}
                </blockquote>
                <p className="mt-2 text-slate-600">{annotation.note}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">{t('review.annotationEmpty')}</p>
        )}
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {submitMutation.isError ? (
          <p className="text-sm text-red-700">{t('review.submitError')}</p>
        ) : null}
        <Button
          type="button"
          disabled={!validation.valid || submitMutation.isPending}
          onClick={submitReview}
        >
          {submitMutation.isPending ? t('review.submitting') : t('review.submitReview')}
        </Button>
      </div>
    </div>
  );
}
