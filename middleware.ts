import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost';
const ESTOQUE_MFE_URL = process.env.NEXT_PUBLIC_ESTOQUE_MFE_URL || 'http://localhost:3001';

export default NextAuth(authConfig).auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.href}`, nextUrl.origin));
  }

  const host = req.headers.get("host");
  if (!host) return NextResponse.next();

  const hostname = host.split(":")[0];
  const subdomain = hostname.endsWith(`.${MAIN_DOMAIN}`)
    ? hostname.replace(`.${MAIN_DOMAIN}`, ""): null;
  
  if (subdomain && subdomain !== 'www' && nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const headers = new Headers(req.headers);

  if (subdomain && subdomain !== 'www') {
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
