import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'bg-primary uppercase border-t-white border-2 border-l-white border-r-black border-b-black px-3 py-1',
        className
      )}
      {...props}>
      {children}
    </button>
  );
};
