"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export default function Dashboard() {
  const t = useTranslations("Dashboard");

  const suggestedPlans = [
    { price: 10, validity: "15 days", data: "3 GB" },
    { price: 30, validity: "60 days", data: "10 GB" },
    { price: 18, validity: "30 days", data: "8 GB" },
  ];

  return (
    <div className="min-h-screen bg-white w-full">
      {/* --- Top Section --- */}
      <div className="relative overflow-hidden">
        {/* Left Curve */}
        <div className="absolute bottom-0 left-0 sm:left-10 opacity-60 sm:opacity-100">
          <Image
            src="/banner-curve-down.svg"
            alt="Decorative curve left"
            width={400}
            height={600}
            priority
          />
        </div>

        {/* Right Curve */}
        <div className="absolute right-0 top-0 sm:right-10 opacity-60 sm:opacity-100">
          <Image
            src="/banner-curve-up.svg"
            alt="Decorative curve right"
            width={400}
            height={600}
            priority
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div>
            {/* Greeting */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-[400px] text-gray-900 mb-2">
              {t("greeting")} <span className="text-primary">Alex</span>
              <span className="ml-2">👋</span>
            </h1>

            {/* Subheader */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
              <p className="text-base sm:text-lg">
                {t("readyForTrip")}
              </p>
              <p className="text-base sm:text-lg">
                {t("lastTransaction")}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Active Plans */}
              <Card className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm">{t("activePlans")}</p>
                  <p className="text-2xl sm:text-3xl font-[400px] text-primary mt-3">
                    2
                  </p>
                </div>
              </Card>

              {/* Wallet Balance */}
              <Card className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm">{t("walletBalance")}</p>
                  <p className="text-2xl sm:text-3xl font-[400px] text-primary mt-3">
                    $50
                  </p>
                </div>
              </Card>

              {/* Last Transaction */}
              <Card className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl">
                <div>
                  <p className="text-2xl sm:text-3xl font-[400px] text-primary">
                    $15
                  </p>
                  <div className="flex justify-between text-[12px]">
                    <div className="">
                      <p className="text-[#545454]">Date</p>
                      <p>{t("date")}</p>
                    </div>
                    <div>
                      <p className="text-[#545454]">{t("validity")}</p>
                      <p>30-day plan</p>
                    </div>
                    <div>
                      <p className="text-[#545454]">{t("data")}</p>
                      <p>USA 5GB</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* --- Suggested Plans Section --- */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-[400px] text-gray-900">
              {t("suggestedPlans")}
            </h2>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedPlans.map((plan, index) => (
              <Card
                key={index}
                className="p-6 bg-white shadow-lg border border-gray-100 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <p className="text-3xl font-[400px] text-primary">
                    ${plan.price}
                  </p>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{t("validity")}</span>
                    <span>{t("data")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      {plan.validity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {plan.data}
                    </span>
                  </div>
                </div>

                <Button className="w-full rounded-full text-white">
                  {t("buyNow")}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
