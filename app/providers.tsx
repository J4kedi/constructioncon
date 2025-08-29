'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'
import { FeatureProvider } from '@/app/contexts/FeatureContext'

interface ProvidersProps extends ThemeProviderProps {
  features: string[];
  children: React.ReactNode;
}

export function Providers({ children, features, ...props }: ProvidersProps) {
  return (
    <NextThemesProvider {...props}>
      <FeatureProvider features={features}>
        {children}
      </FeatureProvider>
    </NextThemesProvider>
  )
}