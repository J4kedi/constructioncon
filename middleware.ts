import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextRequest, NextResponse } from "next/server";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    runtime: 'nodejs',
}

export function middleware (request: NextRequest) {
    const host = request.headers.get('host');

    if (!host) return NextResponse.next(); 

    const parts = host.split('.');

    const isSubdomain = parts.length > 1;

    if (isSubdomain && parts[0] != 'localhost') {
        const tenatId = parts[0];

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-tenant-id', tenatId);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}