"use client";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/routes";
import { resetPassword, resendOtp } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// ✅ Validation schema
export default function ResetPassword() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ResetPassword");
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetSchema = z.object({
    email: z.string().email(t("invalidEmail")),
    otp: z
      .string()
      .min(6, t("otpLength"))
      .max(6, t("otpLength")),
    newPassword: z
      .string()
      .min(6, t("passwordMin"))
      .max(32, t("passwordMax")),
  });

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema as any),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
    },
  });

  // ✅ Autofill email (from URL or storage)
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      form.setValue("email", emailFromUrl);
      return;
    }
    try {
      const regRaw =
        sessionStorage.getItem("registrationState") ||
        localStorage.getItem("registrationState");
      if (regRaw) {
        const parsed = JSON.parse(regRaw || "{}");
        if (parsed?.email) form.setValue("email", parsed.email);
      }
    } catch {
      /* ignore */
    }
  }, [searchParams, form]);

  // ✅ Handle OTP change (6 individual inputs)
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    const currentOtp = form.getValues("otp").split("");
    currentOtp[index] = value;
    const newOtp = currentOtp.join("");
    form.setValue("otp", newOtp);

    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !form.getValues("otp")[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Submit handler
  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setLoading(true);
    try {
      const res = await resetPassword(values);
      toast.success(res.message || t("resetSuccess"));

      // Clear saved email info
      sessionStorage.removeItem("registrationState");
      localStorage.removeItem("registrationState");

      router.push(ROUTES.LOGIN(locale));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("resetFailed");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    try {
      const email = form.getValues("email");

      if (!email) {
        toast.error(t("emailNotFound"));
        return;
      }

      setResendLoading(true);

      await resendOtp(email);

      toast.success(t("otpResent"));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("otpResendFailed");
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-3">
      <main className="flex flex-1 items-center justify-center bg-white dark:bg-gray-950 p-8">
        <div className="max-w-md w-full shadow-lg rounded-2xl overflow-hidden p-8 bg-white dark:bg-gray-900 dark:text-gray-100">
          <h2 className="text-2xl font-normal mb-6 text-center text-gray-900 dark:text-gray-50">
            {t("title")}
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              autoComplete="off"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-200">
                      {t("emailLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled
                        className="bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OTP Field */}
              <FormField
                control={form.control}
                name="otp"
                render={() => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-200">
                      {t("otpLabel")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-between gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Input
                            key={i}
                            ref={(el) => {
                              otpRefs.current[i] = el;
                            }}
                            maxLength={1}
                            className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700 dark:focus:border-primary dark:focus:ring-primary"
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedData = e.clipboardData
                                .getData("Text")
                                .trim();
                              if (!/^\d+$/.test(pastedData)) return;
                              const otpArray = pastedData.slice(0, 6).split("");

                              otpArray.forEach((digit, index) => {
                                if (otpRefs.current[index]) {
                                  otpRefs.current[index]!.value = digit;
                                }
                              });

                              form.setValue("otp", otpArray.join(""));

                              const nextIndex =
                                otpArray.length < 6 ? otpArray.length : 5;
                              otpRefs.current[nextIndex]?.focus();
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>

                    {/* Resend OTP */}
                    <div className="text-right mt-2">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-sm text-primary hover:underline"
                      >
                        {resendLoading ? t("sending") : t("resendOtp")}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password Field */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-200">
                      {t("newPasswordLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t("newPasswordPlaceholder")}
                        className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient from-primary to-indigo-600 text-white"
              >
                {loading ? t("resetting") : t("resetButton")}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
