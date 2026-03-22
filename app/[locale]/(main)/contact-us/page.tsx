"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { contactUS } from "@/services/contactUs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export interface ContactUs {
  name: string;
  email: string;
  message: string;
}

const ContactUs = () => {
  const t = useTranslations("ContactUs");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (mediaQuery.matches) {
      document.documentElement.classList.add("dark");
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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
        message: form.message,
      };
      await contactUS(payload);
      setSuccess(t("messageSent"));
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("messageFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 🌆 Hero Section */}
      <div className="relative w-full h-[22.6vh]">
        <Image
          src="/contact-us-banner.svg"
          alt={t("heroAlt")}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* 📩 Contact Info + Form */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left: Contact Info */}
          <div className="bg-white p-8 rounded-2xl shadow-md w-full lg:w-1/2 dark:bg-gray-800 dark:shadow-lg">
            <h2 className="text-2xl font-[400] mb-4 dark:text-white">
              {t("getInTouch")}
            </h2>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              {t("introText")}
            </p>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-center gap-4 border border-[#E1F2FE] p-4 rounded-b-3xl rounded-tl-3xl hover:shadow dark:border-gray-700">
                <Image src="/mail.svg" alt={t("mailAlt")} width={40} height={40} />
                <div>
                  <p className="dark:text-white">{t("emailTitle")}</p>
                  <a
                    href={`mailto:${t("emailAddress")}`}
                    className="text-[#848484] text-sm dark:text-gray-400"
                  >
                    {t("emailAddress")}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 border border-[#E1F2FE] p-4 rounded-b-3xl rounded-tl-3xl hover:shadow dark:border-gray-700">
                <Image src="/phone.png" alt={t("phoneAlt")} width={40} height={40} />
                <div>
                  <p className="dark:text-white">{t("phoneTitle")}</p>
                  <p className="text-[#848484] text-sm dark:text-gray-400">
                    {t("phoneNumbers")}
                  </p>
                </div>
              </div>

              {/* Chat */}
              <div className="flex items-center gap-4 border border-[#E1F2FE] p-4 rounded-b-3xl rounded-tl-3xl hover:shadow dark:border-gray-700">
                <Image
                  src="/live-chat.svg"
                  alt={t("chatAlt")}
                  width={40}
                  height={40}
                />
                <div>
                  <p className="dark:text-white">{t("chatTitle")}</p>
                  <a
                    href={`https://${t("chatLink")}`}
                    className="text-[#848484] text-sm dark:text-gray-400"
                  >
                    {t("chatLink")}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-10 rounded-2xl shadow-md w-full lg:w-1/2 border border-gray-100 dark:bg-gray-800 dark:shadow-lg dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="name"
                  className="text-gray-600 text-sm dark:text-gray-300"
                >
                  {t("form.nameLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("form.namePlaceholder")}
                  className="px-0 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-gray-600 text-sm dark:text-gray-300"
                >
                  {t("form.emailLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("form.emailPlaceholder")}
                  className="px-0 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-gray-600 text-sm dark:text-gray-300"
                >
                  {t("form.messageLabel")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  className="px-0 border-0 border-b border-gray-300 rounded-none resize-none focus-visible:ring-0 focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={4}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient from-primary to-indigo-600 text-white mt-2"
              >
                {loading ? (
                  <FaSpinner color="text-primary" />
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

export default ContactUs;
