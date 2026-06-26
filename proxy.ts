import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./i18n"

// Language routing
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
})

// Protected routes - auth required
const protectedRoutes = ["/dashboard", "/saved", "/add-opportunity", "/admin"]

export function proxy(request: any) {
  const { nextUrl } = request
  const isLoggedIn = Boolean(request.auth)

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.includes(route)
  )

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL(`/${defaultLocale}/auth/login`, nextUrl)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}