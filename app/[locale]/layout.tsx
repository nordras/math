import type { Metadata } from 'next';
import { Comic_Neue } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-comic',
});

const locales = ['pt', 'en', 'es'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;

  return {
    title: 'Gerador de Exercícios de Matemática',
    description: 'Crie exercícios personalizados de forma rápida e fácil',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} data-theme="vibrant">
      <body className={`${comicNeue.variable} antialiased`}>{children}</body>
    </html>
  );
}
