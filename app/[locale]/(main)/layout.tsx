// "use client";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/header/Header";
import { authFetcher } from "@/lib/authFetcher";
import { hasSession } from "@/lib/session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type ProfileGuardResponse = {
  status?: string;
  message?: string;
  statusCode?: number;
  data?: {
    _id?: string;
  };
};

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pathname = (await headers()).get("x-pathname") || `/${locale}`;
  const pathWithoutLocale = pathname.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname;
  const protectedRoutes = [
    "/dashboard",
    "/my-plans",
    "/renew",
    "/favorites",
    "/wallet",
    "/order-billing",
    "/profile-setting",
    "/support",
  ];
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  if (!isProtectedRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow">{children}</main>
        <Footer locale={locale} />
      </div>
    );
  }

  const session = await hasSession();

  if (!session?.accessToken || !session?.refreshToken) {
    redirect(`/${locale}/login`);
  }

  const profileRes = await authFetcher<ProfileGuardResponse>("/auth/profile");
  if (profileRes?.statusCode === 444) {
    const message = encodeURIComponent(profileRes?.message || "User is blocked");
    redirect(`/${locale}/login?blocked=1&message=${message}`);
  }

  if (!profileRes?.data?._id) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
