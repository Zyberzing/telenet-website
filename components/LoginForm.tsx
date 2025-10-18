"use client";

import { Apple, Chrome, Facebook } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export default function LoginForm() {
  const t = useTranslations("LoginForm");

  return (
    <div className="w-full max-w-md space-y-6 mx-6">
      <div className="text-start">
        <p className="text-gray-500">{t("welcomeText")}</p>
        <h2 className="text-2xl font-bold">{t("loginTitle")}</h2>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("emailLabel")}</label>
        <Input type="email" placeholder={t("emailPlaceholder")} />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("passwordLabel")}</label>
        <Input type="password" placeholder={t("passwordPlaceholder")} />
      </div>

      {/* Login Button */}
      <Button className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white">
        {t("loginButton")}
      </Button>

      {/* Forgot Password */}
      <div>
        <Link href="#" className="text-sm text-primary hover:underline">
          {t("forgotPassword")}
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
        <span className="h-px w-16 bg-gray-200"></span>
        {t("or")}
        <span className="h-px w-16 bg-gray-200"></span>
      </div>

      {/* Social Login */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          size="default"
          aria-label={t("loginWithGoogle")}
        >
          <Chrome className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="default"
          aria-label={t("loginWithApple")}
        >
          <Apple className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="default"
          aria-label={t("loginWithFacebook")}
        >
          <Facebook className="h-5 w-5" />
        </Button>
      </div>

      {/* Register */}
      <div className="text-center text-sm">
        {t("notRegistered")}{" "}
        <Link href="register" className="text-primary hover:underline">
          {t("createAccount")}
        </Link>
      </div>
    </div>
  );
}
