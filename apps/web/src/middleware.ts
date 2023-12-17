import { jwtDecode } from 'jwt-decode';
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  // if the JWT can't be validated because it has been tampered with, getToken will return null
  const token = await getToken({
    req,
    secret,
    raw: true,
  });

  const anonymousRoutes = [
    '/',
    '/auth/signin',
    '/auth/register',
  ]

  const adminRoutes = [
    '/dashboard',
    '/dashboard/organizations',
    '/dashboard/categories',
    '/dashboard/products',
    '/profile',
  ]

  const managerRoutes = [
    '/dashboard',
    '/profile',
    '/dashboard/categories',
    '/dashboard/products',
  ];

  const memberRoutes = [
    '/dashboard',
    '/profile',
  ];

  let allowedRoutes: Array<string> = anonymousRoutes;

  if (token) {
    // if we have a token here, it is verified, we can now decode it using edge runtime compatible jwt-decode module.
    const decodedJwt = jwtDecode<any>(token);
    // TODO more condition based on roles from decodedJwt
    if (!decodedJwt.role) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (decodedJwt.role === 'admin') {
      allowedRoutes = adminRoutes;
    } else if (decodedJwt.role === 'user') {
      if (decodedJwt.organization_role === 'manager') {
        allowedRoutes = managerRoutes;
      } else if (decodedJwt.organization_role === 'member') {
        allowedRoutes = memberRoutes;
      }
    }

    if (!allowedRoutes.some((route) => route === req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  if (!allowedRoutes.some((route) => route === req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};
