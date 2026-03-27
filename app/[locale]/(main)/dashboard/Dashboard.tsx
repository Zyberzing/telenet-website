"use client";

import { useCurrency } from "@/app/providers/CurrencyProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";

interface SuggestedPlan {
  price: number;
  validity: string;
  data: string;
}

interface UserData {
  name: string;
  activePlans: number;
  walletBalance: number;
  lastTransaction: {
    amount: number;
    date: string;
    validity: string;
    data: string;
  };
}

interface DashboardProps {
  suggestedPlans: SuggestedPlan[];
  userData: UserData;
}

export default function Dashboard({
  suggestedPlans,
  userData,
}: DashboardProps) {
  const t = useTranslations("Dashboard");
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {};

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground w-full transition-colors duration-300">
      {/* --- Top Section --- */}
      <div className="relative overflow-hidden">
        {/* Left Curve */}
        <div className="absolute bottom-0 left-0 sm:left-10 opacity-60 sm:opacity-100">
          <Image
            src="/banner-curve-down.svg"
            alt={t("decorativeCurveLeft")}
            width={400}
            height={600}
            priority
          />
        </div>

        {/* Right Curve */}
        <div className="absolute right-0 top-0 sm:right-10 opacity-60 sm:opacity-100">
          <Image
            src="/banner-curve-up.svg"
            alt={t("decorativeCurveRight")}
            width={400}
            height={600}
            priority
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div>
            {/* Greeting */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-[400] text-foreground mb-2">
              {t("greeting")}{" "}
              <span className="text-primary">{userData?.name}</span>
              <span className="ml-2">👋</span>
            </h1>

            {/* Subheader */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
              <p className="text-base sm:text-lg">{t("readyForTrip")}</p>
              <p className="text-base sm:text-lg">{t("lastTransaction")}</p>
            </div>

            {/* Stats Cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Active Plans */}
              <Card className="p-4 bg-card shadow-sm border border-border rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("activePlans")}
                  </p>
                  <p className="text-2xl sm:text-3xl font-[400] text-primary mt-3">
                    {userData?.activePlans || 0}
                  </p>
                </div>
              </Card>

              {/* Wallet Balance */}
              <Card className="p-4 bg-card shadow-sm border border-border rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("walletBalance")}
                  </p>
                  <p className="text-2xl sm:text-3xl font-[400] text-primary mt-3">
                    {formatAmount(userData?.walletBalance || 0)}
                  </p>
                </div>
              </Card>

              {/* Last Transaction */}
              <Card className="p-4 bg-card shadow-sm border border-border rounded-xl">
                <div>
                  <p className="text-2xl sm:text-3xl font-[400] text-primary">
                    {formatAmount(userData?.lastTransaction?.amount || 0)}
                  </p>
                  <div className="flex justify-between text-[12px]">
                    <div>
                      <p className="text-[#545454]">{t("date")}</p>
                      <p>{userData?.lastTransaction?.date || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[#545454]">{t("validity")}</p>
                      <p>{userData?.lastTransaction?.validity || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[#545454]">{t("data")}</p>
                      <p>{userData?.lastTransaction?.data || "-"}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* --- Suggested Plans Section --- */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-[400] text-foreground">
              {t("suggestedPlans")}
            </h2>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedPlans.map((plan, index) => (
              <Card
                key={index}
                className="p-6 bg-card shadow-lg border border-border rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <p className="text-3xl font-[400] text-primary">
                    {formatAmount(plan.price)}
                  </p>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{t("validity")}</span>
                    <span>{t("data")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">
                      {plan.validity}
                    </span>
                    <span className="font-medium text-foreground">
                      {plan.data}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-gradient from-primary to-indigo-600 text-white">
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
