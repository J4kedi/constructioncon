import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast({ title, description, variant = 'default' }: ToastOptions) {
  sonnerToast(title, {
    description,
    className: variant === 'destructive' ? 'bg-red-500 text-white' : '',
  });
}
