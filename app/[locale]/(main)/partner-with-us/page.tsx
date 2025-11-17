"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export interface PartnerWithUs {
  name: string;
  email: string;
  phone: number;
  message: string;
}

const PartnerWithUs = () => {
  const t = useTranslations("PartnerWithUs");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      };
      console.log("payload", payload);
      //   await contactUS(payload);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
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
    <div className="min-h-screen bg-gray-50">
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
          <div className="bg-white p-8 rounded-2xl shadow-md w-full lg:w-1/2">
            <h2 className="text-2xl font-[400] mb-4">{t("partnerTitle")}</h2>
            <p className="text-gray-600 mb-6">{t("introText")}</p>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex gap-4 border p-4 rounded-b-2xl rounded-tl-2xl hover:shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-[400] text-lg shadow-md">
                  1
                </div>

                <div>
                  <p>{t("title1")}</p>
                  <p className="text-[#848484] text-sm">{t("description2")}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 border p-4 rounded-b-2xl rounded-tl-2xl hover:shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-[400] text-lg shadow-md">
                  2
                </div>

                <div>
                  <p>{t("title2")}</p>
                  <p className="text-[#848484] text-sm">{t("description2")}</p>
                </div>
              </div>

              {/* Chat */}
              <div className="flex gap-4 border p-4 rounded-b-2xl rounded-tl-2xl hover:shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-[400] text-lg shadow-md">
                  3
                </div>

                <div>
                  <p>{t("title3")}</p>
                  <p className="text-[#848484] text-sm">{t("description3")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-10 rounded-2xl shadow-md w-full lg:w-1/2 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="text-gray-600 text-sm">
                  {t("form.nameLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("form.namePlaceholder")}
                  className="px-0 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-600 text-sm">
                  {t("form.emailLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("form.emailPlaceholder")}
                  className="px-0 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-600 text-sm">
                  {t("form.phoneLabel")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t("form.phonePlaceholder")}
                  className="px-0 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-600 text-sm">
                  {t("form.messageLabel")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  className="px-0 border-0 border-b border-gray-300 rounded-none resize-none focus-visible:ring-0 focus:border-primary"
                  rows={4}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-medium py-3 rounded-md mt-2 hover:opacity-90 transition-all duration-200"
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

export default PartnerWithUs;
