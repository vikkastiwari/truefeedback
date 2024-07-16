import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
     const token = await getToken({req: request});
     const url = request.nextUrl;
     const isSpecifiedUrl = url.pathname.startsWith('/sign-in') ||
                            url.pathname.startsWith('/sign-up') || 
                            url.pathname.startsWith('/verify')  ||
                            url.pathname.startsWith('/');

     if(token && isSpecifiedUrl) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
     }
     // return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
     '/',
     '/sign-in',
     '/sign-up',
     '/verify/:path*',
     '/dashboard/:path*',
  ],
}