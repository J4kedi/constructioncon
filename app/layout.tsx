import { Providers } from '@/app/providers';
import '@/app/ui/global.css';
import { inter } from './ui/fonts';
import { headers } from 'next/headers';
import { Toaster } from 'sonner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ConstructionCon',
  description: 'Gestão de obras para construtoras',
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico', sizes: 'any' },
      { url: '/favicon_io/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon_io/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers();
  const featureKeysHeader = (await headersList).get('x-tenant-features');
  const featureKeys = featureKeysHeader?.split(',') || [];

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-white to-background dark:bg-gradient-to-br dark:from-secondary/15 dark:to-background`}>
        <Providers attribute="class" defaultTheme="system" enableSystem features={featureKeys}>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}