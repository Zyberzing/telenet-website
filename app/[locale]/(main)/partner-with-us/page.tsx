"use client";

import { Button } from "@/components/ui/Button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { partnerWithUs } from "@/services/partnerWithUs";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export interface PartnerWithUs {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const PartnerWithUsPage = () => {
  const t = useTranslations("PartnerWithUs");
  const countryCodes = getCountries().map((country) => ({
    code: `+${getCountryCallingCode(country)}`,
    country,
  }));

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCountryCodeChange = (value: string) => {
    setForm((prev) => ({ ...prev, countryCode: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        countryCode: form.countryCode,
        phone: form.phone,
        message: form.message,
      };
      console.log("payload", payload);
      await partnerWithUs(payload);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", countryCode: "", message: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send message");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 🌆 Hero Section */}
      <div className="relative w-full h-[22.6vh]">
        <Image
          src="/banner-partner-with-us.svg"
          alt={t("partnerTitle")}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* 📩 Partner Info + Form */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left: Partner Info */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-full lg:w-1/2">
            <h2 className="text-2xl font-[400] mb-4">{t("partnerTitle")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t("introText")}</p>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex gap-4 border border-[#E1F2FE] dark:border-gray-700 p-4 rounded-b-3xl rounded-tl-3xl hover:shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient text-primary-foreground font-[400] text-lg shadow-md">
                  1
                </div>

                <div>
                  <p>{t("title1")}</p>
                  <p className="text-[#848484] dark:text-gray-400 text-sm">{t("description2")}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 border border-[#E1F2FE] dark:border-gray-700 p-4 rounded-b-3xl rounded-tl-3xl hover:shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient text-primary-foreground font-[400] text-lg shadow-md">
                  2
                </div>

                <div>
                  <p>{t("title2")}</p>
                  <p className="text-[#848484] dark:text-gray-400 text-sm">{t("description2")}</p>
                </div>
              </div>

              {/* Chat */}
              <div className="flex gap-4 border border-[#E1F2FE] dark:border-gray-700 p-4 rounded-b-3xl rounded-tl-3xl hover:shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient text-primary-foreground font-[400] text-lg shadow-md">
                  3
                </div>

                <div>
                  <p>{t("title3")}</p>
                  <p className="text-[#848484] dark:text-gray-400 text-sm">{t("description3")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-md w-full lg:w-1/2 border border-gray-100 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="text-gray-600 dark:text-gray-300 text-sm">
                  {t("form.nameLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("form.namePlaceholder")}
                  className="px-0 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none focus-visible:ring-0 focus:border-primary dark:focus:border-primary-light bg-transparent dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-600 dark:text-gray-300 text-sm">
                  {t("form.emailLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("form.emailPlaceholder")}
                  className="px-0 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none focus-visible:ring-0 focus:border-primary dark:focus:border-primary-light bg-transparent dark:text-gray-100 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-600 dark:text-gray-300 text-sm">
                  {t("form.phoneLabel")} <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative w-[120px] mt-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full px-2 pb-1 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none flex justify-between items-center text-left focus-visible:ring-0 focus:border-primary dark:focus:border-primary-light bg-transparent dark:text-gray-100"
                        >
                          {form.countryCode ? (
                            <span>
                              {
                                countryCodes.find((item) => item.code === form.countryCode)
                                  ?.country
                              }{" "}
                              {form.countryCode}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">Code</span>
                          )}
                          <ChevronsUpDown className="h-4 w-4 opacity-50 dark:text-gray-400" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0 w-[120px] bg-white dark:bg-gray-700 border dark:border-gray-600">
                        <Command className="dark:text-gray-100">
                          <CommandInput placeholder="Search country..." className="dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400" />
                          <CommandEmpty className="dark:text-gray-300">No country found.</CommandEmpty>

                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {countryCodes.map(({ code, country }) => (
                              <CommandItem
                                key={`${country}-${code}`}
                                className={cn(
                                  "hover:bg-gradient hover:text-[#fff] cursor-pointer my-[3px]",
                                  form.countryCode === code && "bg-gradient text-[#fff]"
                                )}
                                onSelect={() => handleCountryCodeChange(code)}
                              >
                                {country} ({code})
                                {form.countryCode === code && (
                                  <Check className="ml-auto h-4 w-4 opacity-100 text-white" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t("form.phonePlaceholder")}
                    className="flex-1 px-0 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none focus-visible:ring-0 focus:border-primary dark:focus:border-primary-light bg-transparent dark:text-gray-100 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-600 dark:text-gray-300 text-sm">
                  {t("form.messageLabel")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  className="px-0 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none resize-none focus-visible:ring-0 focus:border-primary dark:focus:border-primary-light bg-transparent dark:text-gray-100 dark:placeholder-gray-400"
                  rows={4}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient text-white font-medium py-3 rounded-md mt-2 hover:opacity-90 transition-all duration-200"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  t("form.submit")
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerWithUsPage;
