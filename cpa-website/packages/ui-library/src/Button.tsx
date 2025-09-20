import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const baseStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-blue-300',
  secondary:
    'border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500 disabled:border-blue-300 disabled:text-blue-300'
};

export const Button = ({ variant = 'primary', className = '', children, ...props }: ButtonProps) => {
  const styles = `${baseStyles[variant]} inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
};
