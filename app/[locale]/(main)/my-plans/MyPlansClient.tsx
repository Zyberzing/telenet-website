"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

export interface Plan {
  id: string;
  orderId: string;
  package_name: string;
  package_data: number;
  perioddays: string;
  unit_price_net_amount: string;
  unit_price_gross_amount: string;
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

interface MyPlansClientProps {
  plans: Plan[];
}

export default function MyPlans({ plans }: MyPlansClientProps) {
  const t = useTranslations("MyPlans");
  const [tab, setTab] = useState<"active" | "expired">("active");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const router = useRouter();
  const locale = useLocale();

  // const demoPlans: Plan[] = [
  //   {
  //     id: "1",
  //     country: "USA",
  //     provider: "Verizon 4G/5G/VoLTE",
  //     flag: "/flags/usa.svg",
  //     dataLeft: "4.2 GB",
  //     totalData: "5 GB",
  //     validUntil: "22 Oct 2025",
  //     price: "$15",
  //     status: "active",
  //   },
  //   {
  //     id: "2",
  //     country: "UK",
  //     provider: "Telefone 5G/VoLTE",
  //     flag: "/flags/uk.svg",
  //     dataLeft: "4.2 GB",
  //     totalData: "5 GB",
  //     validUntil: "22 Oct 2025",
  //     price: "$15",
  //     status: "active",
  //   },
  //   {
  //     id: "3",
  //     country: "Japan",
  //     provider: "NTT DocNet",
  //     flag: "/flags/uk.svg",
  //     expiredOn: "10 Sep 2025",
  //     lastPlan: "5 GB • 30 Days",
  //     price: "$15",
  //     totalData: "",
  //     status: "expired",
  //   },
  //   {
  //     id: "4",
  //     country: "Australia",
  //     provider: "Telstra",
  //     flag: "/flags/uk.svg",
  //     expiredOn: "03 Sep 2025",
  //     lastPlan: "5 GB • 30 Days",
  //     price: "$15",
  //     totalData: "",
  //     status: "expired",
  //   },
  // ];
  console.log("planss", plans);
  // const allPlans = plans?.length ? plans : demoPlans;

  const activePlans = plans;
  const expiredPlans = plans.filter((p) => p.status === "expired");

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
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

          <Button
            onClick={() => router.push(`/${locale}/plans`)}
            className="ml-4 bg-primary text-white hover:bg-primary text-sm"
          >
            <IoIosAddCircleOutline color="white" fontWeight={400} />{" "}
            {t("addNew")}
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
                        src={plan?.flag || "/flags/usa.svg"}
                        alt="flag"
                        width={30}
                        height={50}
                        className="rounded"
                      />
                      <p className="font-medium text-lg">
                        {plan.package_name} – {plan.provider}
                      </p>
                    </div>
                    <div className="text-sm flex justify-between text-gray-500">
                      <p>
                        {plan.package_data >= 1024
                          ? `${parseFloat(
                              (plan.package_data / 1024).toFixed(2)
                            )} GB`
                          : `${plan.package_data} MB`}{" "}
                        {t("dataLeft")}
                      </p>
                      <p>
                        {plan.package_data >= 1024
                          ? `${parseFloat(
                              (plan.package_data / 1024).toFixed(2)
                            )} GB`
                          : `${plan.package_data} MB`}
                      </p>
                    </div>

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
                      {t("validUntil")} {plan.perioddays} days
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <Button
                      onClick={() => router.push(`/${locale}/plans`)}
                      className="bg-primary hover:bg-primary px-10 rounded-full"
                    >
                      {t("renew")}
                    </Button>
                    <Button
                      onClick={() => router.push(`/${locale}/top-up`)}
                      className="bg-black hover:bg-gray-800 px-10 rounded-full"
                    >
                      {t("topUp")}
                    </Button>
                    <Button className="px-10 bg-black hover:bg-gray-800 rounded-full">
                      {t("viewQR")}
                    </Button>
                    <p
                      onClick={() =>
                        router.push(`/${locale}/installation-guide`)
                      }
                      className="border-b border-primary text-primary h-fit place-self-center"
                    >
                      How to install
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    onClick={() => setSelectedPlan(plan)}
                    className="border-b border-primary text-primary h-fit place-self-center cursor-pointer"
                  >
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
            {expiredPlans.length > 0 ? (
              expiredPlans.map((plan) => (
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
              ))
            ) : (
              <p>No expired plan available</p>
            )}
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>

            {/* Header */}
            <h2 className="text-lg font-medium mb-4">
              {selectedPlan.package_name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Order Id {selectedPlan.orderId}
            </p>

            {/* Plan Details */}
            <div className="space-y-2 text-sm text-gray-700">
              <p>Country: {selectedPlan.country}</p>
              <p>
                Data:{" "}
                {selectedPlan.package_data >= 1024
                  ? `${parseFloat(
                      (selectedPlan.package_data / 1024).toFixed(2)
                    )} GB`
                  : `${selectedPlan.package_data} MB`}
              </p>
              <p>
                Unit price gross amount: {selectedPlan.unit_price_gross_amount}
              </p>
              <p>Unit price net amount: {selectedPlan.unit_price_net_amount}</p>

              <p>Validity: {selectedPlan.perioddays} days</p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setSelectedPlan(null)}
                className="bg-primary text-white rounded-full px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
