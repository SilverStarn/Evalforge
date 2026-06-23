import type { ReactNode } from 'react';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  detail?: string;
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card className="space-y-2">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-950">{value}</p>
      {detail ? <p className="text-sm text-slate-500">{detail}</p> : null}
    </Card>
  );
}
