import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

import clsx from 'clsx';

import '@/app/globals.css';

import { QueryProvider } from '@/providers/QueryProvider';

const fontHankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken-grotesk',
  subsets: ['latin'],
});

const fontInter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const fontJetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fe Project Hub',
  description: 'A clean starter for your Next.js app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={clsx(
        fontInter.variable,
        fontHankenGrotesk.variable,
        fontJetBrainsMono.variable,
        'text-foreground bg-background dark h-full antialiased',
      )}
      lang="en"
    >
      <body className="flex flex-col min-h-full">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
