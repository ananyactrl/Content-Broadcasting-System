/**
 * Next.js Proxy (formerly middleware) — route protection by role.
 *
 * Runs on the server before every matched request.
 *
 * Rules:
 * - Unauthenticated users hitting /dashboard/* → redirect to /login
 * - Authenticated users hitting /login → redirect to their dashboard
 * - Authenticated users hitting the wrong dashboard (e.g. teacher hitting
 *   /dashboard/principal) → redirect to their correct dashboard
 *
 * Token is read from the 'cbs-token' cookie set by LoginForm on the client.
 * The cookie carries no sensitive data — just a mock token string.
 * Role is read from the 'cbs-role' cookie (value: "teacher" | "principal").
 *
 * Note: In production, the server would set an HttpOnly cookie and validate
 * it against a session store. The client-set cookie approach here is
 * appropriate for a mock/demo environment only.
 */

import { NextResponse } from 'next/server';

const TEACHER_HOME = '/dashboard/teacher';
const PRINCIPAL_HOME = '/dashboard/principal';
const LOGIN = '/login';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('cbs-token')?.value;
  const role = request.cookies.get('cbs-role')?.value;

  const isAuthenticated = !!token;
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginRoute = pathname === LOGIN || pathname === '/';

  // Unauthenticated → protect dashboard routes
  if (isDashboardRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN;
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting login or root → send to their dashboard
  if (isLoginRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = role === 'principal' ? PRINCIPAL_HOME : TEACHER_HOME;
    return NextResponse.redirect(url);
  }

  // Role-based dashboard protection
  if (isAuthenticated && isDashboardRoute) {
    const isTeacherRoute = pathname.startsWith('/dashboard/teacher');
    const isPrincipalRoute = pathname.startsWith('/dashboard/principal');

    if (isTeacherRoute && role !== 'teacher') {
      const url = request.nextUrl.clone();
      url.pathname = PRINCIPAL_HOME;
      return NextResponse.redirect(url);
    }

    if (isPrincipalRoute && role !== 'principal') {
      const url = request.nextUrl.clone();
      url.pathname = TEACHER_HOME;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
  ],
};
