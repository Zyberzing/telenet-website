import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("LoginPage");

  return (
    <div className="min-h-screen w-full flex flex-col p-3">
      {/* Content */}
      <main className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full shadow-lg rounded-2xl overflow-hidden">
          {/* Left Side Illustration */}
          <div className="hidden md:flex items-center justify-center bg-gray-50 p-0 relative">
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
