import { LucideIcon } from 'lucide-react';
import { InputHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';

const inputVariants = cva(
  'w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all'
);

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  Icon: LucideIcon;
  errors?: string[];
}

export default function InputField({ id, name, label, Icon, className, errors, ...props }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
        <input
          id={id}
          name={name}
          data-testid={`input-${id}`}
          {...props}
          className={clsx(inputVariants({ className }))}
          aria-describedby={`${id}-error`}
        />
      </div>
      <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
        {errors &&
          errors.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>
  );
}
