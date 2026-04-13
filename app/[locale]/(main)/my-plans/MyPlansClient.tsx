"use client";

import { useCurrency } from "@/app/providers/CurrencyProvider";
import QRModal from "@/components/modals/QRModal";
import RefundModal from "@/components/modals/RefundModal";
import BillingModal from "@/components/modals/ViewBillingModal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { getOrderList } from "@/services/order";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

export interface Plan {
  _id: string;
  orderId: string;
  packageId?: string;
  package_name: string;
  package_data: number;
  perioddays: string;
  unit_price_net_amount: string;
  unit_price_gross_amount: string;
  country: string;
  provider: string;
  countryFlag: string;
  dataLeft?: string;
  totalData: string;
  validUntil?: string;
  expiredOn?: string;
  cancelledOn?: string;
  lastPlan?: string;
  price: string;
  status: "active" | "expired" | "cancelled" | string;
  package_sms: number;
  package_call: number;
  qrcode?: string;
  refundStatus?: "processing" | "refunded" | "rejected" | "failed";
  order?: {
    packageId?: string;
    expiryDate: string;
    finalPrice: string;
    country: string;
    cancelledAt?: string;
  };
}
interface MyPlansClientProps {
  plans: Plan[];
  expiredPlan: Plan[];
  cancelledPlan: Plan[];
}

enum RefundStatusEnum {
  PROCESSING = "processing",
  REFUNDED = "refunded",
  REJECTED = "rejected",
  FAILED = "failed",
}
export default function MyPlans({
  plans,
  expiredPlan,
  cancelledPlan,
}: MyPlansClientProps) {
  const t = useTranslations("MyPlans");
  const { formatAmount } = useCurrency();
  const [tab, setTab] = useState<"active" | "expired" | "cancelled">("active");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const activePlans = plans;
  const expiredPlans = expiredPlan;
  const cancelledPlans = cancelledPlan;
  const [showRefund, setShowRefund] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [refundRequestedOrderIds, setRefundRequestedOrderIds] = useState<
    Set<string>
  >(new Set());
  const [refundNoteTargetId, setRefundNoteTargetId] = useState<string | null>(
    null,
  );
  const getRefundStatus = (plan: any): RefundStatusEnum | null => {
    try {
      if (plan?.refundStatus) {
        return plan.refundStatus as RefundStatusEnum;
      }

      if (Array.isArray(plan?.refund) && plan.refund.length > 0) {
        return plan.refund[0]?.status as RefundStatusEnum;
      }

      return null;
    } catch (error) {
      console.error("Refund status error:", error);
      return null;
    }
  };
  useEffect(() => {
    const loadRefundRequestedOrders = async () => {
      const pageSize = 50;
      let currentPage = 1;
      const requestedOrderIds = new Set<string>();

      while (true) {
        const orderData = await getOrderList(currentPage, pageSize);
        if (!orderData) break;

        orderData.result.forEach((order) => {
          if (order.isRefundRequested) {
            requestedOrderIds.add(order._id);
          }
        });

        const totalPages = orderData.pagination?.totalPages ?? currentPage;
        if (currentPage >= totalPages) break;
        currentPage += 1;
      }

      setRefundRequestedOrderIds(requestedOrderIds);
    };

    void loadRefundRequestedOrders();
  }, []);

  const handleRefundSuccess = () => {
    setShowRefund(false);
    setSelectedPlan(null);
    setRefundNoteTargetId(null);
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
                tab === "active" && "bg-primary text-white hover:bg-primary",
              )}
            >
              {t("active")}
            </Button>
            <Button
              variant={tab === "expired" ? "default" : "outline"}
              onClick={() => setTab("expired")}
              className={cn(
                tab === "expired" && "bg-primary text-white hover:bg-primary",
              )}
            >
              {t("expired")}
            </Button>
            <Button
              variant={tab === "cancelled" ? "default" : "outline"}
              onClick={() => setTab("cancelled")}
              className={cn(
                tab === "cancelled" && "bg-primary text-white hover:bg-primary",
              )}
            >
              {t("cancelled")}
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
                {t("noActivePlans")}
              </p>
            ) : (
              activePlans.map((plan, i) => {
                const planTargetId = plan.orderId || plan._id;
                const refundStatus = getRefundStatus(plan);
                const hasRefundRequested = refundRequestedOrderIds.has(
                  plan.orderId,
                );

                return (
                  <div
                    key={plan._id}
                    className="bg-[#F1F8FE] dark:bg-gray-800 flex rounded-2xl p-4 space-y-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 w-1/2">
                        <div className="flex gap-4">
                          <Image
                            src={plan?.countryFlag || "/flags/usa.svg"}
                            alt="flag"
                            width={30}
                            height={50}
                            className="rounded"
                          />
                          <p className="font-medium text-lg dark:text-white">
                            {plan.package_name}
                          </p>
                        </div>
                        <div className="text-sm flex justify-between text-gray-500 dark:text-gray-400">
                          <p>
                            {plan.package_data >= 1024
                              ? `${parseFloat(
                                  (plan.package_data / 1024).toFixed(2),
                                )} GB`
                              : `${plan.package_data} MB`}{" "}
                            {t("dataLeft")}
                          </p>
                          <p>
                            {plan.package_data >= 1024
                              ? `${parseFloat(
                                  (plan.package_data / 1024).toFixed(2),
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
                          onClick={() => {
                            const params = new URLSearchParams({
                              sourceOrderId: plan.orderId || plan._id,
                              packageId: plan.packageId || "",
                              packageName: plan.package_name || "",
                              data: String(plan.package_data || ""),
                              validity: String(plan.perioddays || ""),
                              call: String(plan.package_call || ""),
                              sms: String(plan.package_sms || ""),
                              finalPrice: String(plan.order?.finalPrice || ""),
                              country:
                                plan.country || plan.order?.country || "",
                              provider: plan.provider || "",
                              network: plan.provider || "",
                              coverage: plan.country || "-",
                            });

                            router.push(
                              `${ROUTES.RENEW(locale)}?${params.toString()}`,
                            );
                          }}
                          className="bg-primary dark:text-white hover:bg-primary px-10 rounded-full"
                        >
                          {t("renew")}
                        </Button>
                        {/* <Button
                          onClick={() => router.push(ROUTES.TOP_UP(locale))}
                          className="bg-black dark:text-white dark:hover:text-black dark:hover:bg-purple-50 hover:bg-gray-800 px-10 rounded-full"
                        >
                          {t("topUp")}
                        </Button> */}
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
                          disabled={hasRefundRequested}
                          onClick={() => {
                            if (hasRefundRequested) return;

                            setSelectedPlan(plan);
                            setShowRefund(true);
                          }}
                          className="px-10 bg-black disabled:opacity-50 disabled:cursor-not-allowed dark:text-white dark:hover:text-black dark:hover:bg-purple-50 hover:bg-gray-800 rounded-full"
                        >
                          {t("refund")}
                        </Button>
                        <p
                          onClick={() =>
                            router.push(ROUTES.INSTALLATION_GUIDE(locale))
                          }
                          className="border-b border-primary text-primary h-fit place-self-center cursor-pointer"
                        >
                          {t("howToInstall")}
                        </p>
                      </div>

                      {hasRefundRequested && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center mb-0">
                          {t("refundStatusHint")}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowBilling(true);
                        }}
                        className="border-b border-primary text-primary h-fit place-self-center cursor-pointer"
                      >
                        {t("viewBilling")}
                      </p>

                      {hasRefundRequested && refundStatus && (
                        <p className="text-sm font-medium mt-2">
                          <span
                            className={cn(
                              refundStatus === RefundStatusEnum.PROCESSING &&
                                "text-yellow-600",
                              refundStatus === RefundStatusEnum.REFUNDED &&
                                "text-green-600",
                              refundStatus === RefundStatusEnum.REJECTED &&
                                "text-red-600",
                              refundStatus === RefundStatusEnum.FAILED &&
                                "text-red-500",
                            )}
                          >
                            {
                              {
                                [RefundStatusEnum.PROCESSING]:
                                  t("refundRequested"),
                                [RefundStatusEnum.REFUNDED]:
                                  t("refundApproved"),
                                [RefundStatusEnum.REJECTED]:
                                  t("refundRejected"),
                                [RefundStatusEnum.FAILED]: t("refundFailed"),
                              }[refundStatus]
                            }
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Expired Plans */}
        {tab === "expired" && (
          <div className="space-y-4">
            {expiredPlans.length > 0 ? (
              expiredPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-[#F1F8FE] dark:bg-gray-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center shadow-sm"
                >
                  <div>
                    <div className="flex gap-4">
                      <Image
                        src={plan.countryFlag}
                        alt="flag"
                        width={30}
                        height={50}
                        className="rounded"
                      />
                      <p className="font-medium text-lg dark:text-white">
                        {plan.package_name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 dark:text-gray-400">
                      {t("expiredOn")}{" "}
                      {new Date(
                        plan?.order?.expiryDate || plan.expiredOn || "",
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("lastPlan")}: {plan.lastPlan} •{" "}
                      {formatAmount(plan.order?.finalPrice)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-0">
                    <Button
                      className="bg-black hover:bg-gray-800 rounded-full"
                      onClick={() =>
                        router.push(
                          `${ROUTES.PLANS(locale)}?filterby=Country&country_code=${plan.order?.country}`,
                        )
                      }
                    >
                      {t("viewSimilar")}
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary rounded-full"
                      // onClick={() => {
                      //   setSelectedPlan(plan);
                      //   router.push(
                      //     `${ROUTES.PLANS(locale)}?filterby=Country&country_code=${plan.order?.country}`,
                      //   );
                      // }}
                      onClick={() => {
                        const params = new URLSearchParams({
                          sourceOrderId: plan.orderId || plan._id,
                          packageId:
                            plan.packageId || plan.order?.packageId || "",
                          packageName: plan.package_name || "",
                          data: String(plan.package_data || ""),
                          validity: String(plan.perioddays || ""),
                          call: String(plan.package_call || ""),
                          sms: String(plan.package_sms || ""),
                          finalPrice: String(plan.order?.finalPrice || ""),
                          country: plan.country || plan.order?.country || "",
                          provider: plan.provider || "",
                          network: plan.provider || "",
                          coverage: plan.country || "-",
                        });
                        console.log("Renew params", plan, params.toString());
                        router.push(
                          `${ROUTES.RENEW(locale)}?${params.toString()}`,
                        );
                      }}
                    >
                      {t("repurchase")}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center dark:text-gray-300">
                {t("noExpiredPlans")}
              </p>
            )}
          </div>
        )}

        {/* Cancelled Plans */}
        {tab === "cancelled" && (
          <div className="space-y-4">
            {cancelledPlans.length > 0 ? (
              cancelledPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-[#F1F8FE] dark:bg-gray-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center shadow-sm"
                >
                  <div>
                    <div className="flex gap-4">
                      <Image
                        src={plan.countryFlag}
                        alt="flag"
                        width={30}
                        height={50}
                        className="rounded"
                      />
                      <p className="font-medium text-lg dark:text-white">
                        {plan.package_name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 dark:text-gray-400">
                      {t("cancelledOn")}{" "}
                      {new Date(
                        plan?.order?.cancelledAt ||
                          plan.cancelledOn ||
                          plan?.order?.expiryDate ||
                          plan.expiredOn ||
                          "",
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("lastPlan")}: {plan.lastPlan} •{" "}
                      {formatAmount(plan.order?.finalPrice)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-0">
                    <Button
                      className="bg-black hover:bg-gray-800 rounded-full"
                      onClick={() =>
                        router.push(
                          `${ROUTES.PLANS(locale)}?filterby=Country&country_code=${plan.order?.country}`,
                        )
                      }
                    >
                      {t("viewSimilar")}
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary rounded-full"
                      // onClick={() => {
                      //   setSelectedPlan(plan);
                      //   router.push(
                      //     `${ROUTES.PLANS(locale)}?filterby=Country&country_code=${plan.order?.country}`,
                      //   );
                      // }}
                      onClick={() => {
                        const params = new URLSearchParams({
                          sourceOrderId: plan.orderId || plan._id,
                          packageId:
                            plan.packageId || plan.order?.packageId || "",
                          packageName: plan.package_name || "",
                          data: String(plan.package_data || ""),
                          validity: String(plan.perioddays || ""),
                          call: String(plan.package_call || ""),
                          sms: String(plan.package_sms || ""),
                          finalPrice: String(plan.order?.finalPrice || ""),
                          country: plan.country || plan.order?.country || "",
                          provider: plan.provider || "",
                          network: plan.provider || "",
                          coverage: plan.country || "-",
                        });
                        console.log("Renew params", plan, params.toString());
                        router.push(
                          `${ROUTES.RENEW(locale)}?${params.toString()}`,
                        );
                      }}
                    >
                      {t("repurchase")}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center dark:text-gray-300">
                {t("noCancelledPlans")}
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
