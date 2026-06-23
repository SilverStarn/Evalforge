import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({ className, children, interactive = false, ...props }: CardProps) {
  return (
    <section
      className={clsx(
        'rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42_/_0.05)]',
        interactive && 'interactive-surface',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
