import { useId } from 'react';
import { clsx } from 'clsx';

interface RatingScaleProps {
  label: string;
  value: number | undefined;
  min?: number;
  max?: number;
  required?: boolean;
  error?: string;
  onChange: (value: number) => void;
}

export function RatingScale({
  label,
  value,
  min = 1,
  max = 5,
  required,
  error,
  onChange,
}: RatingScaleProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const values = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  return (
    <fieldset className="space-y-2" aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-semibold text-slate-900">
        {label} {required ? <span className="text-red-700">*</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {values.map((score) => (
          <button
            key={score}
            type="button"
            className={clsx(
              'h-10 min-w-10 rounded-md border text-sm font-semibold shadow-[0_1px_1px_rgb(15_23_42_/_0.04)] transition-[background-color,border-color,color,transform] motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0',
              value === score
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
            )}
            aria-pressed={value === score}
            onClick={() => onChange(score)}
          >
            {score}
          </button>
        ))}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
