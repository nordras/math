import type { Metadata } from 'next';
import { Comic_Neue } from 'next/font/google';
import { notFound } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '../globals.css';
import { getDictionary, hasLocale } from './dictionaries';

const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-comic',
});

const locales = ['en-US', 'pt-BR', 'es'];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Validate locale
  if (!hasLocale(lang)) {
    notFound();
  }

  return (
    <html lang={lang} data-theme="vibrant">
      <body className={`${comicNeue.variable} antialiased`}>
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        {children}
      </body>
    </html>
  );
}
