import { NextRequest, NextResponse } from 'next/server';



const PROTECTED_PREFIXES = [
  '/dashboard',
  '/onboarding',
  '/profile',
  '/explore',
  '/admin',
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtected(pathname)) return NextResponse.next();

  const sessionCookie =
    req.cookies.get('sessionId')?.value ||
    req.cookies.get('accessToken')?.value ||
    req.cookies.get('token')?.value;

  if (!sessionCookie) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth';
    loginUrl.search = '';
    const res = NextResponse.redirect(loginUrl);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }

  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/profile/:path*',
    '/explore/:path*',
    '/admin/:path*',
  ],
};
