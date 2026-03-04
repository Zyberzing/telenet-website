"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  commonFieldSchema,
  countryCodeSchema,
  emailSchema,
  passwordSchema,
  phoneNumberSchema,
} from "@/lib/formSchemaFunctions";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { createUser, socialSignup } from "@/services/auth";
import SocialSignupModal, {
  SocialSignupFormValues,
} from "@/components/SocialSignupModal";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { jwtDecode } from "jwt-decode";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { LoadingButton } from "./ui/loading-button";

const formSchema = z.object({
  name: commonFieldSchema(),
  email: emailSchema(),
  password: passwordSchema(),
  phone: phoneNumberSchema(),
  countryCode: countryCodeSchema(),
});
export type RegistrationFormSchemaType = z.infer<typeof formSchema>;

type GoogleCredentialPayload = {
  email?: string;
  name?: string;
  sub?: string;
};

export default function RegisterForm() {
  const t = useTranslations("RegisterForm");
  const router = useRouter();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCountryIso, setSelectedCountryIso] = useState("");
  const [socialInitialData, setSocialInitialData] = useState({
    email: "",
    name: "",
    phone: "",
    countryCode: "+1",
    firebaseUserId: "",
  });

  // const countryCodes = getCountries().map((country) => ({
  //   code: `+${getCountryCallingCode(country)}`,
  //   country,
  // }));
  const regionNames = new Intl.DisplayNames([locale], {
    type: "region",
  });

  const countryCodes = getCountries().map((country) => ({
    iso: country,
    name: regionNames.of(country) ?? country,
    code: `+${getCountryCallingCode(country)}`,
  }));

  const form = useForm<RegistrationFormSchemaType>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      countryCode: "",
    },
  });

  const onSubmit = async (data: RegistrationFormSchemaType) => {
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        countryCode: data.countryCode,
      };

      const res = await createUser(payload);

      if (res.status !== "success") {
        console.error("Registration failed:", res);
        toast.error(res.message || "Registration failed");
        return; // STOP here, do not continue
      }

      const selectedCountry = countryCodes.find((item) =>
        selectedCountryIso
          ? item.iso === selectedCountryIso
          : item.code === data.countryCode,
      );

      sessionStorage.setItem(
        "registrationState",
        JSON.stringify({
          email: data.email,
          name: data.name,
          phone: data.phone,
          country: selectedCountry?.name || "",
          countryCode: data.countryCode,
          countryIso: selectedCountry?.iso || selectedCountryIso || "",
        }),
      );

      toast.success(res.message);

      router.push(ROUTES.OTP(locale));
    } catch (err: unknown) {
      console.error("Registration failed:", err);

      if (err instanceof Error) {
        form.setError("email", {
          message: err.message || "Invalid credentials",
        });
      } else {
        form.setError("email", { message: "Invalid credentials" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        toast.error("Google signup failed. Missing credential.");
        return;
      }

      setGoogleLoading(true);
      const decoded = jwtDecode<GoogleCredentialPayload>(response.credential);

      setSocialInitialData((prev) => ({
        ...prev,
        email: decoded.email || "",
        name: decoded.name || "",
        firebaseUserId: decoded.sub || "",
      }));
      setSocialDialogOpen(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google signup is unavailable.";
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSocialSignupSubmit = async (socialForm: SocialSignupFormValues) => {
    if (
      !socialForm.email.trim() ||
      !socialForm.name.trim() ||
      !socialForm.phone.trim() ||
      !socialForm.countryCode.trim() ||
      !socialForm.firebaseUserId.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSocialSubmitting(true);
      const res = await socialSignup({
        email: socialForm.email.trim(),
        name: socialForm.name.trim(),
        phone: socialForm.phone.trim(),
        countryCode: socialForm.countryCode.trim(),
        firebaseUserId: socialForm.firebaseUserId.trim(),
        socialMediaPlatform: "GOOGLE",
      });

      const data = res?.data ?? res;
      const accessTokenRaw = data?.accessToken || data?.access || data?.token;
      const refreshTokenRaw = data?.refreshToken || data?.refresh;
      const accessToken = accessTokenRaw
        ? String(accessTokenRaw).replace(/^Bearer\s+/i, "")
        : "";
      const refreshToken = refreshTokenRaw
        ? String(refreshTokenRaw).replace(/^Bearer\s+/i, "")
        : "";
      const selectedCountry = countryCodes.find(
        (item) => item.code === socialForm.countryCode.trim(),
      );

      sessionStorage.setItem(
        "registrationState",
        JSON.stringify({
          email: socialForm.email.trim(),
          name: socialForm.name.trim(),
          phone: socialForm.phone.trim(),
          country: selectedCountry?.name || "",
          countryCode: socialForm.countryCode.trim(),
          countryIso: selectedCountry?.iso || "",
          otpAccessToken: accessToken,
          otpRefreshToken: refreshToken,
        }),
      );

      toast.success(res?.message || "Signed up with Google successfully.");
      setSocialDialogOpen(false);
      router.push(accessToken ? ROUTES.KYC(locale) : ROUTES.OTP(locale));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Social signup is unavailable.";
      toast.error(message);
    } finally {
      setSocialSubmitting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 mx-6"
        >
        <div className="text-start">
          <p className="text-gray-500">{t("welcomeText")}</p>
          <h2 className="text-2xl font-[400]">{t("registerTitle")}</h2>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <label className="text-sm font-medium">{t("fields.name")}</label>
              <FormControl>
                <Input placeholder={t("placeholders.name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <label className="text-sm font-medium">{t("fields.email")}</label>
              <FormControl>
                <Input placeholder={t("placeholders.email")} {...field} />
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
              <label className="text-sm font-medium">
                {t("fields.password")}
              </label>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholders.password")}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
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

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <label className="text-sm font-medium">{t("fields.phone")}</label>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={t("placeholders.phone")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Searchable Country Code Dropdown */}
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <label className="text-sm font-medium">
                {t("fields.countryCode")}
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        <span>
                          {
                            countryCodes.find((item) =>
                              selectedCountryIso
                                ? item.iso === selectedCountryIso
                                : item.code === field.value,
                            )?.name
                          }{" "}
                          {field.value}
                        </span>
                      ) : (
                        <span>{t("placeholders.countryCode")}</span>
                      )}

                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder={t("searchCountry")} />
                    <CommandEmpty>{t("noCountryFound")}</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {countryCodes.map(({ iso, name, code }) => (
                        <CommandItem
                          key={iso}
                          value={`${name.toLowerCase()} ${iso.toLowerCase()} ${code}`}
                          onSelect={() => {
                            setSelectedCountryIso(iso);
                            field.onChange(code);
                            setOpen(false);
                          }}
                        >
                          <ReactCountryFlag
                            svg
                            countryCode={iso}
                            className="mr-2"
                          />
                          {name} ({code})
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedCountryIso === iso && field.value === code
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          type="submit"
          loading={loading}
          label={loading ? t("loading") : t("registerButton")}
          className="w-full bg-gradient from-primary to-indigo-600 text-white cursor-pointer"
        />

        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <span className="h-px w-16 bg-gray-200"></span>
          {t("or")}
          <span className="h-px w-16 bg-gray-200"></span>
        </div>

        {googleLoading ? (
          <LoadingButton
            type="button"
            loading
            disabled
            label={t("loading")}
            className="w-full"
          />
        ) : (
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => toast.error("Google signup failed.")}
              text="signup_with"
              width="320"
            />
          </div>
        )}

        <div className="text-center text-sm flex gap-2 justify-center">
          Already log-in?{" "}
          <p
            onClick={() => router.push(ROUTES.LOGIN(locale))}
            className="text-primary hover:underline cursor-pointer"
          >
            LogIn
          </p>
        </div>
        </form>
      </Form>

      <SocialSignupModal
        open={socialDialogOpen}
        submitting={socialSubmitting}
        initialData={socialInitialData}
        onOpenChange={setSocialDialogOpen}
        onSubmit={handleSocialSignupSubmit}
      />
    </>
  );
}
