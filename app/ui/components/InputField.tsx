import { InputHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import FormFieldWrapper from './FormFieldWrapper';
import { InputFieldProps } from '@/app/lib/definitions';

const inputVariants = cva(
  'w-full pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all'
);

export default function InputField({ id, name, label, Icon, className, errors, ...props }: InputFieldProps) {
  return (
    <FormFieldWrapper id={id} label={label} Icon={Icon} errors={errors}>
      <input
        id={id}
        name={name}
        data-testid={`input-${id}`}
        {...props}
        className={clsx(inputVariants({ className }), { 'pl-10': Icon, 'pl-4': !Icon })}
        aria-describedby={`${id}-error`}
      />
    </FormFieldWrapper>
  );
}
