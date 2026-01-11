import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en-US', 'pt-BR', 'es'];
const defaultLocale = 'pt-BR';

function getLocale(request: Request): string {
  // Get the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Parse the Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, q = 'q=1.0'] = lang.trim().split(';');
      const quality = q.startsWith('q=') ? parseFloat(q.slice(2)) : 1.0;
      return { locale: locale.trim(), quality };
    })
    .sort((a, b) => b.quality - a.quality)
    .map(item => item.locale);

  // Simple matching logic
  for (const lang of languages) {
    const matchedLocale = locales.find(locale => 
      locale.toLowerCase().startsWith(lang.toLowerCase().split('-')[0])
    );
    if (matchedLocale) return matchedLocale;
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*|_next|android-chrome|apple-touch-icon).*)',
  ],
};