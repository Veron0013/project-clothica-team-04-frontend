import type { Metadata } from 'next';
import { Inter, Nunito_Sans } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Loading from './loading';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import AuthPagesLayout from '@/components/AuthPagesLayout/AuthPagesLayout';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';

import ScrollToTopBtn from '@/components/ScrollToTopButton/ScrollToTopButton';

const interSans = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-mono',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Clothica — стильний одяг | Головна',
  description:
    'Clothica — онлайн-магазин базового одягу: універсальні моделі, які легко поєднуються, високоякісні тканини та сучасний дизайн. Оберіть свою базу на кожен день вже сьогодні.',
  keywords: [
    'Clothica',
    'базовий одяг',
    'універсальний стиль',
    'онлайн-магазин одягу Україна',
    'якісний базовий одяг',
    'одяг кожен день',
  ],
  openGraph: {
    title: 'Clothica — стильний одяг | Головна',
    description:
      'Clothica — онлайн-магазин базового одягу: універсальні моделі, які легко поєднуються, високоякісні тканини та сучасний дизайн. Оберіть свою базу на кожен день вже сьогодні.',
    url: 'https://clothica-team-04-frontend.vercel.app/',
    images: [
      {
        url: 'https://res.cloudinary.com/dgqxe7g3j/image/upload/v1763214919/Clothica_c9xfco.webp',
        width: 1200,
        height: 630,
        alt: 'Clothica — базовий стиль одягу',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-theme="light"
      suppressHydrationWarning
    >
      <body
        className={`${interSans.variable} ${nunitoSans.variable} antialiased`}
      >
        <ThemeProvider>
          <TanStackProvider>
            <div className="layout">
              <AuthProvider>
                <Suspense fallback={<Loading />}>
                  <AuthPagesLayout>
                    {children}
                    {modal}
                    <ScrollToTopBtn />
                  </AuthPagesLayout>
                </Suspense>
              </AuthProvider>
            </div>

            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
