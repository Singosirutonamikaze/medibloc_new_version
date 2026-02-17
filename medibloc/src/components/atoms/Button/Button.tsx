import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-white)]',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-white)]',
  success: 'bg-[var(--color-primary)] text-[var(--color-white)]',
  danger: 'bg-[var(--color-black)] text-[var(--color-white)]',
  warning: 'bg-[var(--color-secondary)] text-[var(--color-white)]',
  info: 'bg-[var(--color-primary)] text-[var(--color-white)]',
  light: 'bg-[var(--color-white)] text-[var(--color-black)] border border-[var(--color-black)]',
  dark: 'bg-[var(--color-black)] text-[var(--color-white)]',
};

export const Button = ({
  variant = 'primary',
  children = 'Button',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-opacity hover:opacity-90 ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

