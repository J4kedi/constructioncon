import { Providers } from '@/app/providers';
import '@/app/ui/global.css';
import { inter } from './ui/fonts';
import { headers } from 'next/headers';

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
      <body className={`${inter.className} antialiased bg-background`}>
        <Providers attribute="class" defaultTheme="system" enableSystem features={featureKeys}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
