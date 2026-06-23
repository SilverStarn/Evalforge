import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  detail?: string;
  className?: string;
}

export function MetricCard({ label, value, detail, className }: MetricCardProps) {
  return (
    <Card className={clsx('space-y-2', className)}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-3xl font-semibold text-slate-950">{value}</p>
      {detail ? <p className="text-sm text-slate-500">{detail}</p> : null}
    </Card>
  );
}
