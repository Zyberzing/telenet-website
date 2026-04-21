"use client";

import { User } from "@/app/[locale]/(main)/profile-setting/ProfileSetting";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { PlanDetailsModal } from "@/components/modals";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination, Plan, RenewPlanPayload } from "@/lib/types";
import { createRenewPlan, getRenewalList } from "@/services/order";
import { createCheckout } from "@/services/payment";
import {
  ArrowDownUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  MessageCircleMore,
  Phone,
  RotateCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type RenewalApiItem = {
  _id?: string;
  sourceOrderId?: string;
  source_order_id?: string;
  orderId?: string;
  order_id?: string;
  packageId?: string;
  package_id?: string;
  packageName?: string;
  package_name?: string;
  packageData?: string | number;
  package_data?: string | number;
  data?: string | number;
  periodDays?: string | number;
  perioddays?: string | number;
  validity?: string | number;
  packageCall?: string | number;
  package_call?: string | number;
  call?: string | number;
  packageSms?: string | number;
  package_sms?: string | number;
  sms?: string | number;
  coverage?: string | string[];
  coverageName?: string;
  country?: string;
  country_code?: string;
  countryCode?: string;
  countryIso2?: string;
  provider?: string;
  providerId?: string;
  providerName?: string;
  network?: string;
  networkName?: string;
  fup_policy?: string | null;
  fupPolicy?: string | null;
  finalPrice?: string | number;
  final_price?: string | number;
  price?: string | number;
  unit_price_gross_amount?: string | number;
  basePrice?: string | number;
  base_price?: string | number;
  unit_price_net_amount?: string | number;
  taxAmount?: string | number;
  tax_amount?: string | number;
  stripe?: string | number;
  stripeAmount?: string | number;
  stripe_amount?: string | number;
  markupAmount?: string | number;
  markup_amount?: string | number;
};

type RenewalPlan = Plan & {
  sourceOrderId: string;
  orderId: string;
  country: string;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatPlanData = (value: string | number | undefined) => {
  if (typeof value === "number") {
    return value >= 1024
      ? `${parseFloat((value / 1024).toFixed(2))} GB`
      : `${value} MB`;
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "-";
};

const firstDefined = <T,>(...values: Array<T | null | undefined>) =>
  values.find((value) => value !== undefined && value !== null);

const normalizeCoverage = (
  coverage?: string | string[],
  fallbackCountry?: string,
) => {
  if (Array.isArray(coverage)) {
    const compact = coverage
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    if (compact.length > 0) return compact.join(", ");
  }

  if (typeof coverage === "string" && coverage.trim()) {
    return coverage;
  }

  if (fallbackCountry && String(fallbackCountry).trim()) {
    return String(fallbackCountry);
  }

  return "-";
};

const mapRenewalItemToPlan = (item: RenewalApiItem): RenewalPlan => {
  const packageIdRaw = firstDefined(item.package_id, item.packageId, item._id);
  const planId = String(packageIdRaw || "");
  const sourceOrderId = String(
    firstDefined(
      item.sourceOrderId,
      item.source_order_id,
      item.orderId,
      item.order_id,
      item._id,
    ) || "",
  );
  const countryCode = String(
    firstDefined(
      item.country_code,
      item.countryCode,
      item.countryIso2,
      item.country,
    ) || "",
  );
  const finalPrice = toNumber(
    firstDefined(
      item.finalPrice,
      item.final_price,
      item.price,
      item.unit_price_gross_amount,
    ),
  );
  const basePrice = toNumber(
    firstDefined(item.basePrice, item.base_price, item.unit_price_net_amount),
  );
  const taxAmount = toNumber(firstDefined(item.taxAmount, item.tax_amount));
  const stripeAmount = toNumber(
    firstDefined(item.stripe, item.stripeAmount, item.stripe_amount),
  );

  return {
    _id: planId || sourceOrderId || "unknown-plan",
    package_id: planId || "",
    package_name: String(
      firstDefined(item.package_name, item.packageName) || "-",
    ),
    data: formatPlanData(
      firstDefined(item.package_data, item.packageData, item.data),
    ),
    validity: toNumber(
      firstDefined(item.perioddays, item.periodDays, item.validity),
    ),
    coverage: normalizeCoverage(
      firstDefined(item.coverage, item.coverageName),
      item.country,
    ),
    price: finalPrice,
    basePrice,
    taxAmount,
    stripe: stripeAmount,
    tax: 0,
    call: toNumber(
      firstDefined(item.package_call, item.packageCall, item.call),
    ),
    sms: toNumber(firstDefined(item.package_sms, item.packageSms, item.sms)),
    finalPrice,
    network: String(
      firstDefined(item.network, item.networkName, item.providerName) || "-",
    ),
    fup_policy: firstDefined(item.fup_policy, item.fupPolicy) ?? null,
    countryIso2: countryCode,
    countries: [],
    actionType: "increase",
    markupType: "fixed",
    markupValue: 0,
    markupAmount: toNumber(firstDefined(item.markupAmount, item.markup_amount)),
    percentage: 0,
    provider: String(item.provider || item.providerId || ""),
    sourceOrderId,
    orderId: sourceOrderId,
    country: countryCode,
  };
};

export default function RenewPlans({
  initialPlans,
  initialPagination,
  initialPage,
  initialLimit,
  initialFilters,
  sourceOrderId,
  prefilledPlan,
  userProfile,
}: {
  initialPlans: RenewalApiItem[];
  initialPagination: Pagination | null;
  initialPage: number;
  initialLimit: number;
  initialFilters: {
    startDate: string;
    endDate: string;
    search: string;
    status: string;
  };
  sourceOrderId: string;
  prefilledPlan: RenewalApiItem | null;
  userProfile: User | null;
}) {
  const t = useTranslations("Renew");
  const { formatAmount } = useCurrency();
  const [selectedPlan, setSelectedPlan] = useState<RenewalPlan | null>(null);
  const [renewPlans, setRenewPlans] = useState<RenewalPlan[]>(
    (initialPlans || []).map(mapRenewalItemToPlan),
  );
  const [pagination, setPagination] = useState<Pagination | null>(
    initialPagination,
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const hasAutoOpenedModalRef = useRef(false);
  const prefilledMappedPlan = prefilledPlan
    ? mapRenewalItemToPlan(prefilledPlan)
    : null;

  const totalPages = pagination?.totalPages || 1;
  const statusOptions = useMemo(
    () => ["active", "expired", "cancelled", "completed", "pending", "failed"],
    [],
  );

  useEffect(() => {
    const fetchRenewalPlans = async () => {
      try {
        setLoading(true);
        const response = await getRenewalList(currentPage, limit, {
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          search: filters.search || undefined,
          status: filters.status || undefined,
        });

        if (!response) {
          setRenewPlans([]);
          setPagination(null);
          return;
        }

        setRenewPlans(
          (response.result || []).map((item) =>
            mapRenewalItemToPlan(item as RenewalApiItem),
          ),
        );
        setPagination(response.pagination || null);
      } catch (error) {
        console.error("Error fetching renewal plans:", error);
        toast.error(t("fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    void fetchRenewalPlans();
  }, [
    currentPage,
    limit,
    filters.startDate,
    filters.endDate,
    filters.search,
    filters.status,
    t,
  ]);

  useEffect(() => {
    if (hasAutoOpenedModalRef.current || loading) {
      return;
    }

    if (sourceOrderId && renewPlans.length > 0) {
      const matchedPlan =
        renewPlans.find(
          (plan) =>
            plan.sourceOrderId === sourceOrderId ||
            plan.orderId === sourceOrderId,
        ) || renewPlans[0];

      if (matchedPlan) {
        setSelectedPlan(matchedPlan);
        hasAutoOpenedModalRef.current = true;
        return;
      }
    }

    if (prefilledMappedPlan) {
      setSelectedPlan(prefilledMappedPlan);
      hasAutoOpenedModalRef.current = true;
    }
  }, [sourceOrderId, renewPlans, loading, prefilledMappedPlan]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setFilters({
      startDate: "",
      endDate: "",
      search: sourceOrderId || "",
      status: "",
    });
  };

  const handleBuy = async (
    promotionId?: string,
    travelStartDate?: string,
    travelEndDate?: string,
  ) => {
    if (!userProfile) {
      toast.error(t("loginRequired"));
      return;
    }

    if (!selectedPlan || orderLoading) {
      return;
    }

    const renewPayload: RenewPlanPayload = {
      sourceOrderId: selectedPlan.sourceOrderId || sourceOrderId,
      packageId: selectedPlan.package_id,
      packageName: selectedPlan.package_name,
    };

    if (
      !renewPayload.sourceOrderId ||
      !renewPayload.packageId ||
      !renewPayload.packageName
    ) {
      toast.error(t("missingRenewPayload"));
      return;
    }

    try {
      setOrderLoading(true);
      await createRenewPlan(renewPayload);

      const checkoutResponse = await createCheckout({
        packageId: selectedPlan.package_id,
        country: selectedPlan.country || selectedPlan.countryIso2 || "",
        providerId: selectedPlan.provider,
        customerDOB: userProfile.customerDOB,
        customerPassportDOB: userProfile.customerPassportDOB,
        travelStartDate,
        travelEndDate,
        ...(promotionId ? { couponId: promotionId } : {}),
      });

      toast.success(checkoutResponse?.message || t("orderCreated"));
      setSelectedPlan(null);

      if (checkoutResponse?.data?.url) {
        window.location.href = checkoutResponse.data.url;
      } else {
        toast.error(t("checkoutUrlMissing"));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("orderCreateFailed"));
      }
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* <div className="relative w-full h-[18vh]">
        <Image
          src="/banner-my-plans.svg"
          alt={t("bannerAlt")}
          fill
          className="object-cover object-top"
          priority
        />
      </div> */}

      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl">{t("title")}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Input
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-[240px] bg-white dark:bg-gray-800"
          />

          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            className="w-[170px] bg-white dark:bg-gray-800"
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
            className="w-[170px] bg-white dark:bg-gray-800"
          />

          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">{t("statusPlaceholder")}</option>
            {statusOptions.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-primary hover:underline cursor-pointer"
          >
            <RotateCcw size={14} />
            {t("resetFilters")}
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">{t("loading")}</p>
        ) : renewPlans.length === 0 ? (
          <p className="text-[20px]">{t("noPlans")}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renewPlans.map((plan) => (
                <div key={`${plan.sourceOrderId}-${plan.package_id}`}>
                  <div
                    className="rounded-2xl p-5 shadow-sm border border-gray-100 bg-[#F1F8FE] hover:bg-[#FFF2E0] transition-all duration-300 flex flex-col justify-between cursor-pointer group dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-2xl mb-6">
                        {formatAmount(plan.finalPrice)}
                      </h3>
                      <ChevronRightIcon className="cursor-pointer text-primary group-hover:text-[#E49B2C] transition-colors duration-300" />
                    </div>

                    <div className="flex justify-between">
                      <div className="gap-4">
                        <p className="flex gap-2 items-center">
                          <ArrowDownUp size={15} /> {plan.data}
                        </p>
                        <p className="flex gap-2 items-center">
                          <Phone size={15} /> {plan.call}
                        </p>
                      </div>
                      <div className="gap-4">
                        <p className="flex gap-2 items-center">
                          <Calendar size={15} />
                          {plan.validity} {t("days")}
                        </p>
                        <p className="flex gap-2 items-center">
                          <MessageCircleMore size={15} /> {plan.sms}
                        </p>
                      </div>
                    </div>

                    <Button className="text-white mt-6 text-sm rounded-full w-full transition-all duration-300 group-hover:[background:#E49B2C] group-hover:text-black dark:group-hover:text-white hover:[background:#E49B2C_!important] hover:text-black dark:hover:text-white bg-gradient">
                      {t("buy")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-start mt-8 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft /> {t("prev")}
                </Button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      size="sm"
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  {t("next")} <ChevronRight />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <PlanDetailsModal
        selectedPlan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onBuy={handleBuy}
        orderLoading={orderLoading}
        isLoggedIn={!!userProfile}
      />
    </section>
  );
}
