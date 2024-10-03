import { ReactQueryProvider } from '@/lib/react-query';
import { TailwindIndicator } from '@/shared/components/tailwind-indicator';
import { cn } from '@/shared/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Echoes',
  description: 'Echoes - Citações',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ReactQueryProvider> {children}</ReactQueryProvider>

        <TailwindIndicator />
      </body>
    </html>
  );
}
