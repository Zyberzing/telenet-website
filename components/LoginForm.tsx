"use client";

import { useLoginUserMutation } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { Apple, Chrome, Facebook } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import z from "zod/v3";
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

export default function LoginForm() {
  const t = useTranslations("LoginForm");
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const formSchema = z.object({
    email: z.string().email(t("emailRequired")),
    password: z.string().min(1, t("passwordRequired")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await loginUser(data).unwrap();

      const accessToken = response.data?.access;
      const refreshToken = response.data?.refresh;

      if (!accessToken) {
        throw new Error("No access token returned");
      }

      const decoded: { authId: string; role: string; exp: number } = jwtDecode(
        accessToken.replace("Bearer ", "")
      );

      dispatch(
        setCredentials({
          token: accessToken,
          user: { id: decoded.authId, role: decoded.role },
          refreshToken,
        })
      );

      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      console.error("Login failed:", err);
      form.setError("email", { message: "Invalid credentials" });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 mx-6"
      >
        <div className="text-start">
          <p className="text-gray-500">{t("welcomeText")}</p>
          <h2 className="text-2xl font-[400]">{t("loginTitle")}</h2>
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
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
              <FormLabel>{t("passwordLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white"
        >
          {isLoading ? t("loading") : t("loginButton")}
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
          <Link
            href={`/${locale}/register`}
            className="text-primary hover:underline"
          >
            {t("createAccount")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
