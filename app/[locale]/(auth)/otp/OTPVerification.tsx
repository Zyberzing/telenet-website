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
import { verifyOtp } from "@/services/auth";
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

export type OTPVerificationProps = {
  prefilledEmail?: string;
};

export default function OTPVerification({
  prefilledEmail,
}: OTPVerificationProps) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
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
    if (!/^\d*$/.test(value)) return; // only numbers
    const currentOtp = form.getValues("otp").split("");
    currentOtp[index] = value;
    const newOtp = currentOtp.join("");
    form.setValue("otp", newOtp);

    // Auto-focus next input
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

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    setLoading(true);
    try {
      const res = await verifyOtp(values);
      toast.success(res.message || "OTP verified successfully!");

      // Clear local/session storage
      sessionStorage.removeItem("registrationState");
      localStorage.removeItem("registrationState");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      // Redirect to login
      router.push(ROUTES.LOGIN(locale));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "OTP verification failed!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-3">
      <main className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="max-w-md w-full shadow-lg rounded-2xl overflow-hidden p-8">
          <h2 className="text-2xl font-normal mb-6 text-center">
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
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
                    <FormLabel>Enter OTP</FormLabel>
                    <FormControl>
                      <div className="flex justify-between gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Input
                            key={i}
                            ref={(el) => {
                              otpRefs.current[i] = el;
                            }}
                            maxLength={1}
                            className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-medium"
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
