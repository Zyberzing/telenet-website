"use client";

import { clearSession, saveSession } from "@/lib/session";
import { ROUTES } from "@/routes";
import { loginUser, resendOtp, socialLoginUser } from "@/services/auth";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
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

export const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  kycStatus: z.string().optional(),
});

export type LoginFormSchemaType = z.infer<typeof formSchema>;
type KycPrefillFallback = {
  email?: string;
  name?: string;
  phone?: string;
  country?: string;
  countryCode?: string;
};

export default function LoginForm() {
  const t = useTranslations("LoginForm");
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // ✅ ADD THIS

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const blocked = params.get("blocked");
    const blockedMessage = params.get("message");

    if (blocked === "1") {
      toast.error(blockedMessage || "User is blocked");
    }
  }, []);

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(formSchema as any),
    defaultValues: { email: "", password: "" },
  });

  const completeSignin = async (
    res: any,
    fallback: KycPrefillFallback = {},
  ) => {
    const user =
      typeof res?.user === "object" && res?.user !== null ? res.user : null;
    const responseData =
      typeof res === "object" && res !== null
        ? (res as Record<string, any>)
        : {};

    const responseRole =
      (user as { role?: string } | null)?.role ??
      (res as { role?: string } | null)?.role;

    const normalizedRole = (responseRole || "").toLowerCase();
    if (normalizedRole === "admin") {
      toast.error("This user are not authorized to login.");
      return;
    }

    const isManualKyc =
      (user as { isManualKyc?: boolean } | null)?.isManualKyc ??
      (res as { isManualKyc?: boolean } | null)?.isManualKyc;

    const isSumsubKyc =
      (user as { isSumsubKyc?: boolean } | null)?.isSumsubKyc ??
      (res as { isSumsubKyc?: boolean } | null)?.isSumsubKyc;

    const accessTokenRaw = res.accessToken || res.access;
    const refreshTokenRaw = res.refreshToken || res.refresh;
    if (!accessTokenRaw) throw new Error("Access token missing");
    const accessToken = accessTokenRaw?.replace(/^Bearer\s+/i, "");
    const refreshToken = refreshTokenRaw?.replace(/^Bearer\s+/i, "");
    const rawKycStatus =
      (user as { kycStatus?: string } | null)?.kycStatus ??
      (res as { kycStatus?: string } | null)?.kycStatus;
    const rawKycReason =
      (user as { reason?: string | null } | null)?.reason ??
      (res as { reason?: string | null } | null)?.reason ??
      null;
    const normalizedKycStatus = (rawKycStatus || "").toLowerCase();
    const shouldGoToKyc =
      normalizedKycStatus === "notsubmitted" ||
      normalizedKycStatus === "not_submitted";
    const isPendingKyc =
      normalizedKycStatus === "pending" ||
      normalizedKycStatus === "inreview" ||
      normalizedKycStatus === "in_review" ||
      normalizedKycStatus === "underreview" ||
      normalizedKycStatus === "under_review";
    const isRejectedKyc = normalizedKycStatus === "rejected";

    if (
      shouldGoToKyc ||
      isRejectedKyc ||
      isPendingKyc ||
      (isManualKyc === false && isSumsubKyc === false)
    ) {
      // Rejected/non-approved users should only keep temporary KYC tokens.
      dispatch(logout());
      sessionStorage.removeItem("sumsub_kyc_token");
      try {
        await clearSession();
      } catch {
        // Keep KYC flow usable even if cookie clearing fails.
      }

      sessionStorage.setItem(
        "registrationState",
        JSON.stringify({
          email:
            (user as { email?: string } | null)?.email ||
            (typeof responseData.email === "string"
              ? responseData.email
              : "") ||
            fallback.email ||
            form.getValues("email") ||
            "",
          name:
            (user as { name?: string } | null)?.name ||
            (typeof responseData.name === "string" ? responseData.name : "") ||
            fallback.name ||
            "",
          phone:
            (user as { phone?: string } | null)?.phone ||
            (typeof responseData.phone === "string"
              ? responseData.phone
              : "") ||
            fallback.phone ||
            "",
          country:
            (user as { country?: string } | null)?.country ||
            (typeof responseData.country === "string"
              ? responseData.country
              : "") ||
            fallback.country ||
            "",
          countryCode:
            (user as { countryCode?: string } | null)?.countryCode ||
            (typeof responseData.countryCode === "string"
              ? responseData.countryCode
              : "") ||
            fallback.countryCode ||
            "",
          otpAccessToken: accessToken || "",
          otpRefreshToken: refreshToken || "",
          kycStatus: rawKycStatus || "",
          kycReason: rawKycReason,
        }),
      );

      toast.info(
        isPendingKyc
          ? "Your KYC verification is pending review."
          : isRejectedKyc
            ? rawKycReason ||
            "Your KYC was rejected. Please review and submit again."
            : "Please complete your KYC verification to continue.",
      );
      router.push(ROUTES.KYC(locale));
      return;
    }

    if (normalizedKycStatus !== "approved") {
      const statusLabel = rawKycStatus || "pending";
      toast.error(
        `KYC status is ${statusLabel}. You can login only after approval.`,
      );
      return;
    }

    if (!accessToken) throw new Error("Access token missing");

    await saveSession({
      user,
      token: accessToken,
      refreshToken,
      accessToken: accessToken,
      access: accessToken,
      refresh: refreshToken,
    });

    dispatch(
      setCredentials({
        token: accessToken,
        refreshToken,
        user,
      }),
    );

    toast.success("Signed in successfully.");
    router.push(ROUTES.DASHBOARD(locale));
  };


  const handleResendOtp = async () => {
    try {
      const email = form.getValues("email");

      if (!email) {
        toast.error("Email not found");
        return;
      }

      setResendLoading(true);

      await resendOtp(email);

      toast.success("OTP resent successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend OTP";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (values: LoginFormSchemaType) => {
    try {
      setLoading(true);

      const res = await loginUser(values);
      await completeSignin(res);
    } catch (err: unknown) {
      console.error("Login failed:", err);

      const errorMessage = err instanceof Error ? err.message : "Login failed";

      if (errorMessage.includes("User is not verified")) {
        
        sessionStorage.setItem(
          "registrationState",
          JSON.stringify({ email: form.getValues("email") }),
        );
        // Resend OTP before navigating to OTP page, in case user needs a new one. This also ensures that the OTP is valid and reduces the chance of user facing issues with expired OTPs.
        await handleResendOtp()
        toast.info(
          "Please verify your account with the OTP sent to your email.",
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

  const googleSocialLogin = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        setSocialLoading(true);
        const googleUser = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        ).then((r) => r.json());

        const email = String(googleUser?.email || "");
        const firebaseUserId = String(googleUser?.sub || "");

        if (!email || !firebaseUserId) {
          throw new Error("Failed to fetch Google account details");
        }

        const passwordFromForm = form.getValues("password")?.trim();
        const res = await socialLoginUser({
          email,
          firebaseUserId,
          ...(passwordFromForm ? { password: passwordFromForm } : {}),
        });
        await completeSignin(res, {
          email,
          name: String(googleUser?.name || ""),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Google social login failed";
        const normalized = message.toLowerCase();
        const isUnregisteredSocialUser =
          normalized.includes("invalid firebase user") ||
          normalized.includes("firebase user") ||
          normalized.includes("user not found");

        if (isUnregisteredSocialUser) {
          toast.error("User not registered.");
          // router.push(ROUTES.REGISTER(locale));
          return;
        }

        toast.error(message);
      } finally {
        setSocialLoading(false);
      }
    },
    onError: () => {
      toast.error("Google social login failed");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 mx-6"
      >
        <div className="text-start">
          <p className="text-gray-500 dark:text-gray-300">{t("welcomeText")}</p>
          <h2 className="text-2xl font-normal dark:text-white">
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
            type="button"
            aria-label={t("loginWithGoogle")}
            onClick={() => googleSocialLogin()}
            disabled={socialLoading || loading}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            {socialLoading ? (
              <FaSpinner className="h-5 w-5 animate-spin" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
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
