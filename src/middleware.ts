// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Paths
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_PUBLIC_PATHS = [ADMIN_LOGIN_PATH, '/admin/forgot-password', '/admin/update-password'];
const CLIENT_LOGIN_PATH = '/client/login';
const CLIENT_PUBLIC_PATHS = [CLIENT_LOGIN_PATH, '/client/register', '/client/reset-password'];

// TODO: Remove this OTP bypass flag when OTP is fully implemented
const BYPASS_OTP = true;

export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const isClientPath = pathname.startsWith('/client');

  // --- Admin Auth ---
  if (isAdminPath) {
    const token = request.cookies.get('auth-token')?.value;
    let session = null;

    if (token) {
      try {
        session = jwt.verify(token, process.env.JWT_SECRET!);
      } catch {
        session = null;
      }
    }

    const isAuthenticated = !!session;
    const isPublicAdminPath = ADMIN_PUBLIC_PATHS.includes(pathname);

    if (isAuthenticated) {
      if (isPublicAdminPath || pathname === '/admin') {
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
      }
      return NextResponse.next();
    } else {
      if (!isPublicAdminPath && pathname !== '/admin') {
        return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
      }
      return NextResponse.next();
    }
  }

  // --- Client Auth ---
  if (isClientPath) {
    const isPublicClientPath = CLIENT_PUBLIC_PATHS.includes(pathname);

    // Complete bypass mode - skip all authentication
    if (BYPASS_OTP) {
      // Allow access to all client paths when bypassing
      if (pathname === '/client') {
        return NextResponse.redirect(new URL(CLIENT_LOGIN_PATH, request.url));
      }
      return NextResponse.next();
    }

    // Normal authentication flow (when BYPASS_OTP is false)
    const token = request.cookies.get('client_token')?.value;
    let clientSession = null;

    if (token) {
      try {
        clientSession = jwt.verify(token, process.env.JWT_SECRET!) as any;
      } catch {
        clientSession = null;
      }
    }

    const isAuthenticated = !!clientSession;

    if (isAuthenticated) {
      // Normal OTP flow
      if (clientSession && !clientSession.otpVerified) {
        // Redirect to OTP verification page if not verified
        return NextResponse.redirect(new URL('/client/verify-otp', request.url));
      }

      if (isPublicClientPath || pathname === '/client') {
        return NextResponse.redirect(
          new URL(`/client/${clientSession.id}/home`, request.url)
        );
      }
      return NextResponse.next();
    } else {
      if (!isPublicClientPath && pathname !== '/client') {
        return NextResponse.redirect(new URL(CLIENT_LOGIN_PATH, request.url));
      }
      if (pathname === '/client') {
        return NextResponse.redirect(new URL(CLIENT_LOGIN_PATH, request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}