"use client";

import { saveSession } from "@/lib/session";
import { loginUser } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
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

export const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormSchemaType = z.infer<typeof formSchema>;

export default function   LoginForm() {
  const t = useTranslations("LoginForm");
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormSchemaType) => {
    try {
      setLoading(true);

      const res = await loginUser(values);
      console.log("token", res)
      toast.success("Signed in successfully.")
      const accessTokenRaw = res.access; // directly from response
      const refreshTokenRaw = res.refresh;

      if (!accessTokenRaw) throw new Error("Access token missing");

      const accessToken = accessTokenRaw.replace(/^Bearer\s+/i, "");
      const refreshToken = refreshTokenRaw?.replace(/^Bearer\s+/i, "");

      // const { accessToken:access, refreshToken:refresh } = await loginUser(values);

      // // Strip "Bearer " prefix
      // const accessToken = access.replace(/^Bearer\s+/i, "");
      // const refreshToken = refresh.replace(/^Bearer\s+/i, "");

      if (!accessToken) throw new Error("Access token missing");

      // Decode access token to get user info
      const decoded: { authId: string; role: string; exp: number } =
        jwtDecode(accessToken);

      // Save session (localStorage / cookie)
      saveSession({
        user: decoded.authId,
        token: accessToken,
        refreshToken,
        accessToken: accessToken,
        access: accessToken,
        refresh: refreshToken
      });

      // Store in Redux
      dispatch(
        setCredentials({
          token: accessToken,
          user: { id: decoded.authId, role: decoded.role },
          refreshToken,
        })
      );

      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error("Login failed:", err);
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
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white"
        >
          {loading ? <FaSpinner color="text-primary" /> : t("loginButton")}
        </Button>

        {/* Forgot Password */}
        <div>
          <p className="text-sm text-primary hover:underline cursor-pointer">
            {t("forgotPassword")}
          </p>
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
        <div className="text-center text-sm flex gap-2 justify-center">
          {t("notRegistered")}{" "}
          <p
            onClick={() => router.push(`/${locale}/register`)}
            className="text-primary hover:underline cursor-pointer"
          >
            {t("createAccount")}
          </p>
        </div>
      </form>
    </Form>
  );
}
