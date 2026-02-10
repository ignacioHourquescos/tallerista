import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|static|.*\\..*|_next).*)'],
};

export function middleware(req: NextRequest) {
  // Middleware deshabilitado - aplicación pública sin autenticación
  return NextResponse.next();
}
