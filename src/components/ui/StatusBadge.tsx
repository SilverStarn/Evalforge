import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TaskStatus } from '@/types/domain';

const classes: Record<TaskStatus, string> = {
  unassigned: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-yellow-100 text-yellow-800',
  submitted: 'bg-blue-100 text-blue-800',
  needs_review: 'bg-purple-100 text-purple-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { t } = useTranslation();

  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        classes[status],
      )}
    >
      {t(`status.${status}`)}
    </span>
  );
}
