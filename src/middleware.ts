import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
 
const locales = ['en', 'de'];
const defaultLocale = 'de';
 
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});
 
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('mock_session');
 
  const pathLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  let pathWithoutLocale = pathLocale ? pathname.substring(pathLocale.length + 1) : pathname;
  if (!pathWithoutLocale.startsWith('/')) {
    pathWithoutLocale = '/' + pathWithoutLocale;
  }
  if (pathWithoutLocale === '/') {
    // an empty path means it's the root, which can be / or /de etc.
    const isRoot = pathname === '/' || locales.some(l => `/${l}` === pathname || `/${l}/` === pathname);
    if (!isRoot) {
        pathWithoutLocale = pathname;
    }
  }

  const publicPaths = ['/login'];
  const isPublicPath = publicPaths.some(p => pathWithoutLocale === p);
 
  if (isPublicPath) {
    if (sessionCookie) {
      // User is logged in, redirect from login to home
      return NextResponse.redirect(new URL(`/${pathLocale || defaultLocale}`, req.url));
    }
    // Allow access to public path for unauthenticated users
    return intlMiddleware(req);
  }
 
  // If no session and not a public path, redirect to login
  if (!sessionCookie) {
    const loginUrl = new URL(`/${pathLocale || defaultLocale}/login`, req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl);
  }
 
  return intlMiddleware(req);
}
 
export const config = {
  // Match all paths except for static files, API routes, and the _next directory
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
