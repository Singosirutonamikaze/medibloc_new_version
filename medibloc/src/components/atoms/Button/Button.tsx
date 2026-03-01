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
  primary: 'bg-(--color-primary) text-(--color-white)',
  secondary: 'bg-(--color-secondary) text-(--color-white)',
  success: 'bg-(--color-primary) text-(--color-white)',
  danger: 'bg-(--color-black) text-(--color-white)',
  warning: 'bg-(--color-secondary) text-(--color-white)',
  info: 'bg-(--color-primary) text-(--color-white)',
  light: 'bg-(--color-white) text-(--color-black) border border-(--color-black)',
  dark: 'bg-(--color-black) text-(--color-white)',
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

