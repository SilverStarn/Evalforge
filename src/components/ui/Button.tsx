import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border border-blue-700 bg-blue-700 text-white hover:bg-blue-800 disabled:bg-blue-300',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50 disabled:text-slate-400',
  ghost:
    'border border-transparent bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-400',
  danger: 'border border-red-700 bg-red-700 text-white hover:bg-red-800 disabled:bg-red-300',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-[0_1px_1px_rgb(15_23_42_/_0.04)] transition-[background-color,border-color,color,box-shadow,transform] disabled:cursor-not-allowed motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
