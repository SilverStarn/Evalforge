import { RatingScale } from '@/components/ui/RatingScale';
import { getNumberScore, getStringArrayScore, getTextScore, type ReviewDraft } from './reviewDraft';
import type { ReviewValidationError } from '@/lib/rubrics/validation';
import type { Rubric, RubricScoreValue } from '@/types/domain';

interface RubricScoringFormProps {
  rubric: Rubric;
  scores: ReviewDraft['scores'];
  errors: Record<string, ReviewValidationError>;
  getErrorMessage: (error: ReviewValidationError | undefined) => string | undefined;
  onScoreChange: (criterionId: string, value: RubricScoreValue) => void;
}

const inputClasses =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-[inset_0_1px_1px_rgb(15_23_42_/_0.04)] focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20';

export function RubricScoringForm({
  rubric,
  scores,
  errors,
  getErrorMessage,
  onScoreChange,
}: RubricScoringFormProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {rubric.criteria.map((criterion) => {
        const error = getErrorMessage(errors[criterion.id]);
        const errorId = `${criterion.id}-error`;

        if (criterion.type === 'rating') {
          return (
            <RatingScale
              key={criterion.id}
              label={criterion.label}
              value={getNumberScore(scores, criterion.id)}
              min={criterion.min}
              max={criterion.max}
              required={criterion.required}
              error={error}
              onChange={(value) => onScoreChange(criterion.id, value)}
            />
          );
        }

        if (criterion.type === 'boolean') {
          const fieldId = `criterion-${criterion.id}`;
          return (
            <div key={criterion.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <input
                  id={fieldId}
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-blue-700"
                  checked={scores[criterion.id] === true}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => onScoreChange(criterion.id, event.target.checked)}
                />
                <label htmlFor={fieldId}>
                  <span className="block text-sm font-semibold text-slate-900">
                    {criterion.label}{' '}
                    {criterion.required ? <span className="text-red-700">*</span> : null}
                  </span>
                  <span className="block text-sm text-slate-600">{criterion.description}</span>
                </label>
              </div>
              {error ? (
                <p id={errorId} className="mt-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </div>
          );
        }

        if (criterion.type === 'single_select') {
          const fieldId = `criterion-${criterion.id}`;
          return (
            <label
              key={criterion.id}
              htmlFor={fieldId}
              className="block space-y-2 text-sm font-semibold text-slate-900"
            >
              <span>
                {criterion.label}{' '}
                {criterion.required ? <span className="text-red-700">*</span> : null}
              </span>
              <select
                id={fieldId}
                className={inputClasses}
                value={getTextScore(scores, criterion.id)}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => onScoreChange(criterion.id, event.target.value)}
              >
                <option value="" />
                {criterion.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {error ? (
                <span id={errorId} className="block text-sm font-normal text-red-700">
                  {error}
                </span>
              ) : null}
            </label>
          );
        }

        if (criterion.type === 'multi_select') {
          const selected = getStringArrayScore(scores, criterion.id);
          return (
            <fieldset
              key={criterion.id}
              className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              aria-describedby={error ? errorId : undefined}
            >
              <legend className="text-sm font-semibold text-slate-900">
                {criterion.label}{' '}
                {criterion.required ? <span className="text-red-700">*</span> : null}
              </legend>
              <p className="text-sm text-slate-600">{criterion.description}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {criterion.options?.map((option) => {
                  const optionId = `${criterion.id}-${option.replace(/\W+/g, '-').toLowerCase()}`;
                  return (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        id={optionId}
                        type="checkbox"
                        className="h-4 w-4 accent-blue-700"
                        checked={selected.includes(option)}
                        onChange={(event) => {
                          const nextValue = event.target.checked
                            ? [...selected, option]
                            : selected.filter((item) => item !== option);
                          onScoreChange(criterion.id, nextValue);
                        }}
                      />
                      <label htmlFor={optionId} className="text-sm text-slate-700">
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
              {error ? (
                <p id={errorId} className="text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </fieldset>
          );
        }

        return (
          <label
            key={criterion.id}
            className="block space-y-2 text-sm font-semibold text-slate-900 lg:col-span-2"
          >
            <span>
              {criterion.label}{' '}
              {criterion.required ? <span className="text-red-700">*</span> : null}
            </span>
            <textarea
              className={`${inputClasses} min-h-28 font-normal`}
              value={getTextScore(scores, criterion.id)}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => onScoreChange(criterion.id, event.target.value)}
            />
            {error ? (
              <span id={errorId} className="block text-sm font-normal text-red-700">
                {error}
              </span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}
