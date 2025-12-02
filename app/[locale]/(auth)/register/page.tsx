import RegisterForm from "@/components/RegisterForm";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function LoginPage() {
  const t = useTranslations("LoginPage");

  return (
    <div className="min-h-screen w-full flex flex-col p-3 bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
          {/* Left Side Illustration */}
          <div className="hidden md:flex items-center justify-center bg-gray-50 p-0 relative dark:bg-gray-800">
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
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}
