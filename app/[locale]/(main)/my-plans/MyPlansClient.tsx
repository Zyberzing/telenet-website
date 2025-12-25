"use client";

import QRModal from "@/components/modals/QRModal";
import RefundModal from "@/components/modals/RefundModal";
import BillingModal from "@/components/modals/ViewBillingModal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
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
  package_sms: number;
  package_call: number;
  qrcode?: string;
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
  const activePlans = plans;
  const expiredPlans = plans.filter((p) => p.status === "expired");
  const [showRefund, setShowRefund] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showBilling, setShowBilling] = useState(false);

  const handleRefundSuccess = () => {
    setShowRefund(false);
    setSelectedPlan(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
            onClick={() => router.push(ROUTES.PLANS(locale))}
            className="ml-4 bg-primary text-white hover:bg-primary text-sm"
          >
            <IoIosAddCircleOutline color="white" fontWeight={400} />{" "}
            {t("addNew")}
          </Button>
        </div>

        {/* Active Plans */}
        {tab === "active" && (
          <div className="space-y-4">
            {activePlans.length === 0 ? (
              <p className="text-center dark:text-gray-300">
                No active plan available
              </p>
            ) : (
              activePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#F1F8FE] dark:bg-gray-800 flex rounded-2xl p-4 space-y-4 shadow-sm"
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
                        <p className="font-medium text-lg dark:text-white">
                          {plan.package_name} – {plan.provider}
                        </p>
                      </div>
                      <div className="text-sm flex justify-between text-gray-500 dark:text-gray-400">
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("validUntil")} {plan.perioddays} days
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <Button
                        onClick={() => router.push(ROUTES.PLANS(locale))}
                        className="bg-primary dark:text-white hover:bg-primary px-10 rounded-full"
                      >
                        {t("renew")}
                      </Button>
                      <Button
                        onClick={() => router.push(ROUTES.TOP_UP(locale))}
                        className="bg-black dark:text-white dark:hover:text-black dark:hover:bg-purple-50 hover:bg-gray-800 px-10 rounded-full"
                      >
                        {t("topUp")}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowQR(true);
                        }}
                        className="px-10 bg-black dark:text-white dark:hover:text-black dark:hover:bg-purple-50 hover:bg-gray-800 rounded-full"
                      >
                        {t("viewQR")}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowRefund(true);
                        }}
                        className="px-10 bg-black dark:text-white dark:hover:text-black dark:hover:bg-purple-50 hover:bg-gray-800 rounded-full"
                      >
                        {t("refund")}
                      </Button>
                      <p
                        onClick={() =>
                          router.push(ROUTES.INSTALLATION_GUIDE(locale))
                        }
                        className="border-b border-primary text-primary h-fit place-self-center cursor-pointer"
                      >
                        How to install
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowBilling(true);
                      }}
                      className="border-b border-primary text-primary h-fit place-self-center cursor-pointer"
                    >
                      View Billing
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Expired Plans */}
        {tab === "expired" && (
          <div className="space-y-4">
            {expiredPlans.length > 0 ? (
              expiredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#F1F8FE] dark:bg-gray-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center shadow-sm"
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
                      <p className="font-medium text-lg dark:text-white">
                        {plan.country} – {plan.provider}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 dark:text-gray-400">
                      {t("expiredOn")} {plan.expiredOn}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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
              <p className="text-center dark:text-gray-300">
                No expired plan available
              </p>
            )}
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      <BillingModal
        open={showBilling}
        plan={selectedPlan}
        onClose={() => setShowBilling(false)}
      />

      <RefundModal
        open={showRefund}
        plan={selectedPlan}
        onClose={() => {
          setShowRefund(false);
          setSelectedPlan(null);
        }}
        onRefundSuccess={handleRefundSuccess}
      />

      <QRModal
        open={showQR}
        plan={selectedPlan}
        onClose={() => {
          setShowQR(false);
          setSelectedPlan(null);
        }}
      />
    </div>
  );
}
