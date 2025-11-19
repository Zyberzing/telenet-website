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
import { forgotPassword } from "@/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// ✅ Validation schema
const forgotSchema = z.object({
  email: z.email("Invalid email"),
});

export type ForgotPasswordProps = {
  prefilledEmail?: string;
};

export default function ForgotPassword({
  prefilledEmail,
}: ForgotPasswordProps) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
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

      toast.success(res.message || "OTP sent to your email!");

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
        err instanceof Error ? err.message : "Failed to send reset email!";
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
            Forgot Password
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
                        placeholder="Enter your registered email"
                        className="bg-gray-50"
                      />
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
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
