import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Định nghĩa các routes
const publicRoutes = [
  '/auth/sign-in', 
  '/auth/sign-up', 
  '/auth/forgot-password', 
  '/auth/reset-password',
  '/auth/verify-email'
];
const protectedRoutes = ['/admin', '/dashboard', '/account', '/wallet'];
const authRoutes = ['/auth/sign-in', '/auth/sign-up'];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Kiểm tra token từ cookie (refreshToken) thay vì accessToken
	const refreshToken = request.cookies.get('refreshToken')?.value;
	const isAuthenticated = !!refreshToken;

  // Nếu đang ở trang auth và đã đăng nhập -> redirect về dashboard
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/admin/default', request.url));
  }

  // Nếu truy cập protected route mà chưa đăng nhập -> redirect về sign-in
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname); // Lưu trang muốn truy cập
    return NextResponse.redirect(signInUrl);
  }

  // Redirect root path
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/default', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|img).*)',
  ],
};