import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TaskStatus } from '@/types/domain';

const statusStyles: Record<TaskStatus, { root: string; dot: string }> = {
  unassigned: {
    root: 'border-slate-300 bg-white text-slate-700',
    dot: 'bg-slate-400',
  },
  in_progress: {
    root: 'border-amber-300 bg-amber-50 text-amber-800',
    dot: 'bg-amber-500',
  },
  submitted: {
    root: 'border-blue-300 bg-blue-50 text-blue-800',
    dot: 'bg-blue-500',
  },
  needs_review: {
    root: 'border-violet-300 bg-violet-50 text-violet-800',
    dot: 'bg-violet-500',
  },
  approved: {
    root: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-500',
  },
  rejected: {
    root: 'border-rose-300 bg-rose-50 text-rose-800',
    dot: 'bg-rose-500',
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { t } = useTranslation();
  const styles = statusStyles[status];

  return (
    <span
      className={clsx(
        'inline-flex w-fit max-w-full items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-medium leading-5',
        styles.root,
      )}
    >
      <span aria-hidden="true" className={clsx('h-1.5 w-1.5 rounded-full', styles.dot)} />
      {t(`status.${status}`)}
    </span>
  );
}
