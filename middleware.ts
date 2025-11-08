import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Public routes that don't require login
// const publicRoutes = [
//   "/",
//   "/login",
//   "/admin/login",
//   "/agent/register",
//   "/agent/login",
// ];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🟢 Allow public routes
  // if (publicRoutes.includes(pathname)) {
  //   return NextResponse.next();
  // }

  // 🍪 Check for session cookie
  const cookieName = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME!;
  const token = req.cookies.get(cookieName)?.value;
  
  // 🔒 Redirecct too login mif nso session
  // if (!token) {
    // return NextResponse.redirect(new URL("/", req.url));
  // }
  // ✅ User logged in → allow access
  return NextResponse.next();
}

// ⚙️ Matcher automatically excludes system/static/api routes and images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
