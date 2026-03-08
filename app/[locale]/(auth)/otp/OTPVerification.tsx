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
import { OTPVerificationProps } from "@/lib/types";
import { ROUTES } from "@/routes";
import { verifyOtp, resendOtp } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const otpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export default function OTPVerification({
  prefilledEmail,
}: OTPVerificationProps) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema as any),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  // 6 input refs for OTP
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Autofill email from prop or local/session storage
  useEffect(() => {
    if (prefilledEmail) {
      form.setValue("email", prefilledEmail);
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
  }, [prefilledEmail, form]);

  // Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const otpArray = form.getValues("otp").padEnd(6, " ").split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("").trim();

    form.setValue("otp", newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !form.getValues("otp")[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const otpArray = Array(6).fill("");

    digits.forEach((digit, index) => {
      otpArray[index] = digit;
      if (otpRefs.current[index]) {
        otpRefs.current[index]!.value = digit;
      }
    });

    form.setValue("otp", otpArray.join(""));

    const focusIndex = digits.length >= 6 ? 5 : digits.length;
    otpRefs.current[focusIndex]?.focus();
  };

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    setLoading(true);
    try {
      const res = await verifyOtp(values);
      toast.success(res.message || "OTP verified successfully!");

      try {
        const regRaw =
          sessionStorage.getItem("registrationState") ||
          localStorage.getItem("registrationState");
        const parsed = regRaw ? JSON.parse(regRaw) : {};

        const nextRegistrationState = {
          ...parsed,
          email: values.email,
          otpAccessToken: res?.data?.access || "",
          otpRefreshToken: res?.data?.refresh || "",
        };

        sessionStorage.setItem(
          "registrationState",
          JSON.stringify(nextRegistrationState),
        );
      } catch {}

      router.push(ROUTES.KYC(locale));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "OTP verification failed!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
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

  return (
    <div className="min-h-screen w-full flex flex-col p-3">
      <main className="flex flex-1 items-center justify-center bg-white dark:bg-gray-900 p-8">
        <div className="max-w-md w-full shadow-lg rounded-2xl overflow-hidden p-8 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-normal mb-6 text-center text-gray-900 dark:text-white">
            Verify your email
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
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled
                        className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OTP 6 Boxes */}
              <FormField
                control={form.control}
                name="otp"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Enter OTP
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
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:border-primary focus:ring-1 focus:ring-primary bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handleOtpPaste}
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
                        {resendLoading ? "Sending..." : "Resend OTP"}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient from-primary to-indigo-600 text-white"
              >
                {loading ? "Verifying..." : "Verify & Go to Login"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}