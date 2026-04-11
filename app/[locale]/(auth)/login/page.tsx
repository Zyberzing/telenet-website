import LoginForm from "@/components/LoginForm";
import { getPageMetadata } from "@/services/seo";
import Image from "next/image";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "login");
}

export default function LoginPage() {
  const t = useTranslations("LoginPage");

  return (
    <div className="min-h-screen w-full flex flex-col p-3 bg-gray-100 dark:bg-gray-950">
      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:shadow-xl dark:shadow-gray-800">
          {/* Left Side Illustration */}
          <div className="hidden md:flex items-center justify-center bg-gray-50 dark:bg-gray-800 p-0 relative">
            <Image
              src="/login-banner.png"
              alt={t("imageAlt")}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Side Login Form */}
          <div className="flex items-center justify-center p-8">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
