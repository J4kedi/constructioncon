import React from 'react';

export type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  text: string;
  variant: BadgeVariant;
  className?: string;
}

export default function Badge({ text, variant, className = '' }: BadgeProps) {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full capitalize tracking-wider";
  
  const variantStyles: Record<BadgeVariant, string> = {
    primary: "bg-blue-500/20 text-blue-400",
    accent: "bg-purple-500/20 text-purple-400",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
    neutral: "bg-gray-500/20 text-gray-400",
  };

  return (
    <span className={`${baseClasses} ${variantStyles[variant]} ${className}`}>
      {text}
    </span>
  );
}
