import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/',
  '/product',
  '/product/add',
  '/product/id',
  '/category',
  '/category/add',
  '/warehouse',
  '/inventory',
];

const authRoutes = ['/login', '/register'];

const Middleware = async (request: NextRequest): Promise<NextResponse> => {
  const refreshToken = request.cookies.get('refreshToken');
  const path = request.nextUrl.pathname;
  console.log('first', refreshToken);
  if (!refreshToken && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin).toString());
  }
  if (refreshToken && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin).toString());
  }
  return NextResponse.next();
};

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  // matcher: ['/((?!api|_next|.*\\..*).*)'],
  matcher: ['/((?!api|_next|.*\\..*).*)', '/', '/login', '/product/:path*', '/category/:path*'],
};

export default Middleware;
