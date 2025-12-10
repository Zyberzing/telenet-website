import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/otp",
  "/forgot-password",
  "/reset-password",
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
  "/blog/:slug",
];

const locales = ["en", "fr", "es"]; // supported languages

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Extract locale if present
  const pathSegments = pathname.split("/");
  const maybeLocale = pathSegments[1]; // string | undefined

  let pathWithoutLocale = pathname;

  // ✅ Fix: ensure maybeLocale is a string before includes()
  if (maybeLocale && locales.includes(maybeLocale)) {
    pathWithoutLocale = "/" + pathSegments.slice(2).join("/");
    if (pathWithoutLocale === "/") pathWithoutLocale = "/";
  } else {
    // Redirect to default locale if missing
    const defaultLocale = "en";
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, req.url)
    );
  }

  // Allow public routes
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes(":")) {
      // Simple pattern matching for :slug, :id etc
      const routeRegex = new RegExp(
        "^" + route.replace(/:[^\s/]+/g, "([^/]+)") + "$"
      );
      return routeRegex.test(pathWithoutLocale);
    }
    return route === pathWithoutLocale;
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check session cookie
  const cookieName = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME!;
  const token = req.cookies.get(cookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL(`/${maybeLocale || ""}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
