
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface FormFieldWrapperProps {
  id: string;
  label: string;
  Icon?: LucideIcon;
  errors?: string[];
  children: ReactNode;
}

export default function FormFieldWrapper({ id, label, Icon, errors, children }: FormFieldWrapperProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />}
        {children}
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
