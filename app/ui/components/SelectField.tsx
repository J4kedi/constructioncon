'use client';

import { SelectHTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import FormFieldWrapper from './FormFieldWrapper';
import { SelectFieldProps } from '@/app/lib/definitions';

const selectVariants = cva(
  'w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none'
);

export default function SelectField({ id, name, label, Icon, className, children, errors, ...props }: SelectFieldProps) {
  return (
    <FormFieldWrapper id={id} label={label} Icon={Icon} errors={errors}>
      <select
        id={id}
        name={name}
        {...props}
        className={clsx(selectVariants({ className }))}
        aria-describedby={`${id}-error`}
      >
        {children}
      </select>
    </FormFieldWrapper>
  );
}
