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
import { forgotPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// ✅ Validation schema
export type ForgotPasswordProps = {
  prefilledEmail?: string;
};

export default function ForgotPassword({
  prefilledEmail,
}: ForgotPasswordProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ForgotPassword");
  const [loading, setLoading] = useState(false);

  const forgotSchema = z.object({
    email: z.string().email(t("invalidEmail")),
  });

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema as any),
    defaultValues: {
      email: "",
    },
  });

  // ✅ Autofill email from prop or storage
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

  // ✅ Submit handler
  async function onSubmit(values: z.infer<typeof forgotSchema>) {
    setLoading(true);
    try {
      const res = await forgotPassword(values);

      toast.success(res.message || t("otpSent"));

      // Save email temporarily
      sessionStorage.setItem(
        "registrationState",
        JSON.stringify({ email: values.email })
      );

      // ✅ Navigate to reset password page with email in query
      router.push(
        `/${locale}/reset-password?email=${encodeURIComponent(values.email)}`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("sendFailed");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-3">
      <main className="flex flex-1 items-center justify-center bg-white dark:bg-gray-950 p-8">
        <div className="max-w-md w-full shadow-lg dark:shadow-none dark:border dark:border-gray-700 rounded-2xl overflow-hidden p-8">
          <h2 className="text-2xl font-normal mb-6 text-center dark:text-white">
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
                    <FormLabel className="dark:text-gray-300">
                      {t("emailLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
                {loading ? t("sending") : t("sendOtp")}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
