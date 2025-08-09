import { getToken } from "next-auth/jwt"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth")

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Redirect to signin if not authenticated and not on auth page
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Redirect to dashboard if authenticated and on auth page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
}
