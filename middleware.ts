import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost';

const protectedRoutes: Record<string, UserRole[]> = {
  '/dashboard/users': [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN],
  '/dashboard/global-users': [UserRole.SUPER_ADMIN],
  '/dashboard/tenants': [UserRole.SUPER_ADMIN],
  '/dashboard/scripts': [UserRole.SUPER_ADMIN],
  '/dashboard/status': [UserRole.SUPER_ADMIN],
};

export default NextAuth(authConfig).auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.role;
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isLoginPage = nextUrl.pathname.startsWith('/login');

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  if (isOnDashboard && isLoggedIn) {
    const isAtDashboardRoot = nextUrl.pathname === '/dashboard';
    const isAdmin = userRole === UserRole.COMPANY_ADMIN || userRole === UserRole.SUPER_ADMIN;

    if (!isAdmin && !isAtDashboardRoot) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    const path = nextUrl.pathname;
    const protectedRoute = Object.keys(protectedRoutes).find(r => path.startsWith(r));

    if (protectedRoute) {
      const requiredRoles = protectedRoutes[protectedRoute];
      if (!userRole || !requiredRoles.includes(userRole)) {
        return NextResponse.rewrite(new URL('/404', nextUrl));
      }
    }
  }

  const host = req.headers.get("host");
  if (!host) return NextResponse.next();

  const hostname = host.split(":")[0];
  const subdomain = hostname.endsWith(`.${MAIN_DOMAIN}`)
    ? hostname.replace(`.${MAIN_DOMAIN}`, ""): null;

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.href}`, nextUrl.origin));
  }

  if (isLoggedIn && !isOnDashboard && !subdomain && userRole !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL(`/dashboard`, nextUrl.origin));
  }

  if (subdomain && subdomain !== 'www' && nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const headers = new Headers(req.headers);

  if (subdomain && subdomain !== 'www' && !headers.has('x-tenant-id')) {
    try {
      const tenantApiUrl = new URL(`/api/tenant/${subdomain}`, nextUrl.origin);
      const response = await fetch(tenantApiUrl);

      if (response.ok) {
        const tenant = await response.json();
        const featureKeys = tenant.features.map((f: { key: string }) => f.key).join(',');

        headers.set('x-tenant-id', tenant.id);
        headers.set('x-tenant-subdomain', tenant.subdomain);
        headers.set('x-tenant-features', featureKeys);
      }
    } catch (error) {
      console.error("Middleware fetch error:", error);
    }
  }

  return NextResponse.next({
    request: {
      headers: headers,
    },
  });
});

export const config = {
  matcher: [
    
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
};
