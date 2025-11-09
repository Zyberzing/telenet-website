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
import { createUser } from "@/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useForm } from "react-hook-form";
import z from "zod";
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
import { LoadingButton } from "./ui/loading-button";

const formSchema = z.object({
  name: commonFieldSchema(),
  email: emailSchema(),
  password: passwordSchema(),
  phone: phoneNumberSchema(),
  countryCode: countryCodeSchema(),
});
export type RegistrationFormSchemaType = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const t = useTranslations("RegisterForm");
  const router = useRouter();
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const countryCodes = getCountries().map((country) => ({
    code: `+${getCountryCallingCode(country)}`,
    country,
  }));

  const form = useForm<RegistrationFormSchemaType>({
    resolver: zodResolver(formSchema),
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

      await createUser(payload);
      router.push(`/${locale}/login`);
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

  return (
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
              <FormLabel>{t("fields.name")}</FormLabel>
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
              <FormLabel>{t("fields.email")}</FormLabel>
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
              <FormLabel>{t("fields.password")}</FormLabel>
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
              <FormLabel>{t("fields.phone")}</FormLabel>
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
              <FormLabel>{t("fields.countryCode")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span>
                          {
                            countryCodes.find(
                              (item) => item.code === field.value
                            )?.country
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
                      {countryCodes.map(({ code, country }) => (
                        <CommandItem
                          key={country}
                          value={code}
                          onSelect={() => field.onChange(code)}
                        >
                          <ReactCountryFlag
                            svg
                            countryCode={country}
                            className="mr-2"
                          />
                          {country} ({code})
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === code ? "opacity-100" : "opacity-0"
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
          className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white"
        />

        <div className="text-center text-sm flex gap-2 justify-center">
          Already log-in?{" "}
          <p
            onClick={() => router.push(`/${locale}/login`)}
            className="text-primary hover:underline cursor-pointer"
          >
            LogIn
          </p>
        </div>
      </form>
    </Form>
  );
}
