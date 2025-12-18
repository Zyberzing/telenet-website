import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/contact-us",
  "/about-us",
  "/top-up",
  "/plans",
  "/installation-guide",
  "/virtual-number",
  "/partner-with-us",
  "/destination",
  "/region",
  "/blog",
  "/kyc",
];

const authRoutes = [
  "/login",
  "/register",
  "/otp",
  "/forgot-password",
  "/reset-password",
];

const protectedRoutes = [
  "/dashboard",
  "/my-plans",
  "/wallet",
  "/order-billing",
  "/profile-setting",
  "/support",
];

const locales = ["en", "fr", "es"];
const DEFAULT_LOCALE = "en";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieName =
    process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "APP_SESSION";
  const session = req.cookies.get(cookieName)?.value;

  const segments = pathname.split("/").filter(Boolean);
  const locale =
    segments[0] && locales.includes(segments[0]) ? segments[0] : DEFAULT_LOCALE;

  const pathWithoutLocale =
    segments[0] && locales.includes(segments[0])
      ? `/${segments.slice(1).join("/")}`
      : pathname;

  const isPublic = publicRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some((route) => pathWithoutLocale === route);

  const isProtected = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  /** 🔐 Logged-in user trying to access login/register */
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  /** 🚫 Not logged-in user trying to access protected routes */
  if (!session && isProtected) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  /** ✅ Public pages always allowed */
  if (isPublic || isAuthRoute) {
    return NextResponse.next();
  }

  /** 🧭 Fallback */
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
