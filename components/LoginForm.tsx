"use client";

import { saveSession } from "@/lib/session";
import { ROUTES } from "@/routes";
import { loginUser } from "@/services/auth";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, Chrome, Eye, EyeOff, Facebook } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import router from "next/dist/shared/lib/router/router";

export const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  kycStatus: z.string().optional(),
});

export type LoginFormSchemaType = z.infer<typeof formSchema>;

export default function LoginForm() {
  const t = useTranslations("LoginForm");
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(formSchema as any),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormSchemaType) => {
    try {
      setLoading(true);

      const res = await loginUser(values);
      const user =
        typeof res?.user === "object" && res?.user !== null ? res.user : null;
      const rawKycStatus =
        (user as { kycStatus?: string } | null)?.kycStatus ??
        (res as { kycStatus?: string } | null)?.kycStatus;
      const normalizedKycStatus = (rawKycStatus || "").toLowerCase();

      if (normalizedKycStatus !== "approved") {
        const statusLabel = rawKycStatus || "pending";
        toast.error(
          `KYC status is ${statusLabel}. You can login only after approval.`,
        );
        // return router.push(ROUTES.KYC(locale));
      }

      const accessTokenRaw = res.accessToken || res.access;
      const refreshTokenRaw = res.refreshToken || res.refresh;

      if (!accessTokenRaw) throw new Error("Access token missing");

      const accessToken = accessTokenRaw.replace(/^Bearer\s+/i, "");
      const refreshToken = refreshTokenRaw?.replace(/^Bearer\s+/i, "");

      if (!accessToken) throw new Error("Access token missing");

      // Save session (localStorage / cookie)
      await saveSession({
        user,
        token: accessToken,
        refreshToken,
        accessToken: accessToken,
        access: accessToken,
        refresh: refreshToken,
      });

      // Save credentials to Redux
      dispatch(
        setCredentials({
          token: accessToken,
          refreshToken,
          user,
        }),
      );

      toast.success("Signed in successfully.");
      router.push(ROUTES.DASHBOARD(locale));
    } catch (err: unknown) {
      console.error("Login failed:", err);

      const errorMessage = err instanceof Error ? err.message : "Login failed";

      if (errorMessage.includes("User is not verified")) {
        toast.info(
          "Please verify your account with the OTP sent to your email.",
        );

        sessionStorage.setItem(
          "registrationState",
          JSON.stringify({ email: form.getValues("email") }),
        );

        router.push(ROUTES.OTP(locale));
        return;
      }

      toast.error(errorMessage || "Invalid credentials");

      form.setError("email", { message: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 mx-6"
      >
        <div className="text-start">
          <p className="text-gray-500 dark:text-gray-300">{t("welcomeText")}</p>
          <h2 className="text-2xl font-[400] dark:text-white">
            {t("loginTitle")}
          </h2>
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white">
                {t("emailLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white">
                {t("passwordLabel")}
              </FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    {...field}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient from-primary to-indigo-600 text-white"
        >
          {loading ? <FaSpinner className="animate-spin" /> : t("loginButton")}
        </Button>

        <div>
          <p
            className="text-sm text-primary hover:underline cursor-pointer"
            onClick={() => router.push(ROUTES.FORGOT_PASSWORD(locale))}
          >
            {t("forgotPassword")}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm dark:text-gray-500">
          <span className="h-px w-16 bg-gray-200 dark:bg-gray-700"></span>
          {t("or")}
          <span className="h-px w-16 bg-gray-200 dark:bg-gray-700"></span>
        </div>

        {/* Social */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="default"
            aria-label={t("loginWithGoogle")}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            <Chrome className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="default"
            aria-label={t("loginWithApple")}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            <Apple className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="default"
            aria-label={t("loginWithFacebook")}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            <Facebook className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center text-sm flex gap-2 justify-center dark:text-gray-300">
          {t("notRegistered")}{" "}
          <p
            onClick={() => router.push(ROUTES.REGISTER(locale))}
            className="text-primary hover:underline cursor-pointer"
          >
            {t("createAccount")}
          </p>
        </div>
      </form>
    </Form>
  );
}
