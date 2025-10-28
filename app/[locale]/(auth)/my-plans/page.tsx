"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

interface Plan {
  id: string;
  country: string;
  provider: string;
  flag: string;
  dataLeft?: string;
  totalData: string;
  validUntil?: string;
  expiredOn?: string;
  lastPlan?: string;
  price: string;
  status: "active" | "expired";
}

export default function MyPlans() {
  const t = useTranslations("MyPlans");
  const [tab, setTab] = useState<"active" | "expired">("active");

  const plans: Plan[] = [
    {
      id: "1",
      country: "USA",
      provider: "Verizon 4G/5G/VoLTE",
      flag: "/flags/usa.svg",
      dataLeft: "4.2 GB",
      totalData: "5 GB",
      validUntil: "22 Oct 2025",
      price: "$15",
      status: "active",
    },
    {
      id: "2",
      country: "UK",
      provider: "Telefone 5G/VoLTE",
      flag: "/flags/uk.svg",
      dataLeft: "4.2 GB",
      totalData: "5 GB",
      validUntil: "22 Oct 2025",
      price: "$15",
      status: "active",
    },
    {
      id: "3",
      country: "Japan",
      provider: "NTT DocNet",
      flag: "/flags/uk.svg",
      expiredOn: "10 Sep 2025",
      lastPlan: "5 GB • 30 Days",
      price: "$15",
      status: "expired",
      totalData: "",
    },
    {
      id: "4",
      country: "Australia",
      provider: "Telstra",
      flag: "/flags/uk.svg",
      expiredOn: "03 Sep 2025",
      lastPlan: "5 GB • 30 Days",
      price: "$15",
      status: "expired",
      totalData: "",
    },
  ];

  const activePlans = plans.filter((p) => p.status === "active");
  const expiredPlans = plans.filter((p) => p.status === "expired");

  return (
    <div className="min-h-screen bg-white">
      {/* Title */}
      <div className="relative">
        <Image
          src="/banner-my-plans.svg"
          alt={t("title")}
          width={1500}
          height={1000}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex justify-between space-x-2 mb-8">
          <div className="flex gap-4">
            <Button
              variant={tab === "active" ? "default" : "outline"}
              onClick={() => setTab("active")}
              className={cn(
                tab === "active" && "bg-primary text-white hover:bg-primary"
              )}
            >
              {t("active")}
            </Button>
            <Button
              variant={tab === "expired" ? "default" : "outline"}
              onClick={() => setTab("expired")}
              className={cn(
                tab === "expired" && "bg-primary text-white hover:bg-primary"
              )}
            >
              {t("expired")}
            </Button>
          </div>

          <Button className="ml-4 bg-primary text-white hover:bg-primary text-sm">
            <IoIosAddCircleOutline color="white" fontWeight={400} />  {t("addNew")}
          </Button>
        </div>

        {/* Active Plans */}
        {tab === "active" && (
          <div className="space-y-4">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-[#F1F8FE] flex rounded-2xl p-4 space-y-4 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex flex-col gap-2 w-1/2">
                    <div className="flex gap-4">
                      <Image
                        src={plan.flag}
                        alt="flag"
                        width={30}
                        height={50}
                        className="rounded"
                      />
                      <p className="font-medium text-lg">
                        {plan.country} – {plan.provider}
                      </p>
                    </div>
                    <div className="text-sm flex justify-between text-gray-500">
                      <p>
                        {plan.dataLeft} {t("dataLeft")}
                      </p>
                      <p>{plan.totalData}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#FF7623] h-1.5"
                        style={{
                          width: `${
                            (parseFloat(plan.dataLeft || "0") /
                              parseFloat(plan.totalData)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      {t("validUntil")} {plan.validUntil}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <Button className="bg-primary hover:bg-primary px-10 rounded-full">
                      {t("renew")}
                    </Button>
                    <Button className="bg-black hover:bg-gray-800 px-10 rounded-full">
                      {t("topUp")}
                    </Button>
                    <Button className="px-10 bg-black hover:bg-gray-800 rounded-full">
                      {t("viewQR")}
                    </Button>
                    <p className="border-b border-primary text-primary h-fit place-self-center">
                      How to install
                    </p>
                  </div>
                </div>
                <div>
                  <p className="border-b border-primary text-primary h-fit place-self-center">
                    View Billing
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expired Plans */}
        {tab === "expired" && (
          <div className="space-y-4">
            {expiredPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-[#F1F8FE] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center shadow-sm"
              >
                <div>
                  <div className="flex gap-4">
                    <Image
                      src={plan.flag}
                      alt="flag"
                      width={30}
                      height={50}
                      className="rounded"
                    />
                    <p className="font-medium text-lg">
                      {plan.country} – {plan.provider}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    {t("expiredOn")} {plan.expiredOn}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("lastPlan")}: {plan.lastPlan} • {plan.price}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-0">
                  <Button className="bg-black hover:bg-gray-800 rounded-full">
                    {t("viewSimilar")}
                  </Button>
                  <Button className="bg-primary hover:bg-primary rounded-full">
                    {t("repurchase")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
