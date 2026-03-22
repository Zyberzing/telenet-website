"use client";

import { PlanDetailsModal } from "@/components/modals";
import { PlanFilters } from "@/components/plans";
import { PlanCardSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { orderDetails, Plan, PlansProps } from "@/lib/types";
import { createCheckout } from "@/services/payment";
import {
  ArrowDownUp,
  Calendar,
  ChevronRightIcon,
  MessageCircleMore,
  Phone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function Plans({
  countries,
  regions,
  result = [],
  selectedCountry,
  selectedRegion,
  filterby,
  userProfile,
}: PlansProps) {
  const t = useTranslations("Plans");
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = useSearchParams();
  const urlFilterBy =
    search.get("filterby") === "Region" ? "region" : "country";
  const urlCountry = search.get("country_code") ?? "";
  const urlRegion = search.get("region_name") ?? "";
  const urlDataSize = Number(search.get("data_size") ?? 50);
  const urlMaxValidity = Number(search.get("max_validity"));
  const urlPlanType = Number(search.get("plan_name") ?? 1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plansList, setPlansList] = useState<Plan[]>(result);
  const [orderLoading, setOrderLoading] = useState(false);
  const [filterType, setFilterType] = useState<"country" | "region">(
    filterby === "Region" ? "region" : "country",
  );
  const [internalSelectedCountry, setInternalSelectedCountry] =
    useState(selectedCountry);
  const [internalSelectedRegion, setInternalSelectedRegion] =
    useState(selectedRegion);
  const [dataSize, setDataSize] = useState([
    Number(searchParams.get("data_size")) || 50,
  ]);
  const [maxValidity, setMaxValidity] = useState(
    Number(searchParams.get("max_validity")) || undefined,
  );
  const [isPending, startTransition] = useTransition();
  const [planType, setPlanType] = useState(
    Number(searchParams.get("plan_name")) || 1,
  );

  useEffect(() => {
    setPlansList(result);
  }, [result]);

  useEffect(() => {
    setFilterType(urlFilterBy);
    setInternalSelectedCountry(urlCountry);
    setInternalSelectedRegion(urlRegion);
    setDataSize([urlDataSize]);
    setMaxValidity(urlMaxValidity || undefined);
    setPlanType(urlPlanType);
  }, [
    urlFilterBy,
    urlCountry,
    urlRegion,
    urlDataSize,
    urlMaxValidity,
    urlPlanType,
  ]);

  const selectedDataSize = dataSize?.[0] ?? 0;
  const selectedMaxValidity = maxValidity;

  const updateUrlAndReload = ({
    newDataSize,
    newMaxValidity,
    newCountry,
    newRegion,
    newFilterType,
    newPlanType,
  }: {
    newDataSize?: number;
    newMaxValidity?: number;
    newCountry?: string;
    newRegion?: string;
    newFilterType?: "country" | "region";
    newPlanType?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const filter = newFilterType ?? filterType;
    const size = newDataSize ?? selectedDataSize;
    const maxValidityValue = newMaxValidity ?? selectedMaxValidity;
    const country = newCountry ?? internalSelectedCountry;
    const region = newRegion ?? internalSelectedRegion;

    params.set("filterby", filter === "country" ? "Country" : "Region");
    params.set("plan_name", (newPlanType ?? planType).toString());
    params.set("data_size", size.toString());
    params.set("max_validity", maxValidityValue?.toString() || "");
    params.delete("country_code");
    params.delete("region_name");

    if (filter === "country") {
      params.set("country_code", country);
    } else {
      params.set("region_name", region);
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleBuy = async (
    promotionId?: string,
    travelStartDate?: string,
    travelEndDate?: string,
  ): Promise<void> => {
    if (!userProfile) {
      toast.error(t("loginRequired"));
      return Promise.resolve();
    }

    if (!selectedPlan || orderLoading) {
      return Promise.resolve();
    }

    const orderBody: orderDetails = {
      packageId: selectedPlan?._id,
      country: selectedCountry,
      providerId: selectedPlan?.provider,
      customerDOB: userProfile?.customerDOB,
      customerPassportDOB: userProfile?.customerPassportDOB,
      travelStartDate,
      travelEndDate,
      ...(promotionId ? { couponId: promotionId } : {}),
    };

    try {
      setOrderLoading(true);
      const res = await createCheckout(orderBody);
      toast.success(res.message || t("orderCreated"));

      setSelectedPlan(null);

      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(t("checkoutUrlMissing"));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        console.error(err);
      } else {
        toast.error(t("orderCreateFailed"));
        console.error(err);
      }
    } finally {
      setOrderLoading(false);
    }

    return Promise.resolve();
  };

  return (
    <section className="w-full min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Banner */}
      <div className="relative w-full h-[22.6vh]">
        <Image
          src="/banner-plans.svg"
          alt={t("bannerAlt")}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:h-[calc(100vh)-88px-22.6vh]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:h-full">
          {/* Filter Component */}
          <PlanFilters
            filterType={filterType}
            setFilterType={setFilterType}
            countries={countries.map((c) => ({
              label: c.name,
              value: c.iso2,
            }))}
            regions={regions.map((r) => ({
              label: r.name,
              value: r.name,
            }))}
            selectedCountry={internalSelectedCountry}
            selectedRegion={internalSelectedRegion}
            onCountryChange={(v) => {
              setFilterType("country");
              setInternalSelectedCountry(v);
              updateUrlAndReload({
                newFilterType: "country",
                newCountry: v,
              });
            }}
            onRegionChange={(v) => {
              setFilterType("region");
              setInternalSelectedRegion(v);
              updateUrlAndReload({
                newFilterType: "region",
                newRegion: v,
              });
            }}
            dataSize={dataSize}
            onDataSizeChange={setDataSize}
            onDataSizeCommit={(v) => {
              updateUrlAndReload({ newDataSize: v[0] });
            }}
            maxValidity={maxValidity}
            onMaxValidityChange={setMaxValidity}
            onMaxValidityCommit={(v) => {
              updateUrlAndReload({ newMaxValidity: v });
            }}
            planType={planType}
            onPlanTypeChange={(type) => {
              setPlanType(type);
              updateUrlAndReload({ newPlanType: type });
            }}
            countryLabel={t("country")}
            regionLabel={t("region")}
            filterTitle={t("filterTitle")}
          />

          {/* Plans - Scrollable */}
          <main className="lg:col-span-4 lg:overflow-y-auto lg:h-full lg:pr-2 scrollbar-thin">
            <div className="pb-6">
              <h1 className="text-start text-2xl md:text-3xl font-[400px] mb-6 sticky top-0 bg-white z-10 pb-2 dark:bg-gray-900">
                {t("popularPlans")}
              </h1>

              {isPending ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PlanCardSkeleton key={i} />
                  ))}
                </div>
              ) : plansList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plansList.map((plan) => (
                    <div key={plan.package_id}>
                      {/* <div className="flex justify-between items-center mb-1">
                        {plan.network && (
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="max-w-40 truncate block text-[14px] capitalize font-medium text-white rounded-[7px] px-2 bg-primary cursor-default">
                                  {plan.network}
                                </span>
                              </TooltipTrigger>

                              <TooltipContent className="bg-black text-white px-3 py-2 text-xs rounded-lg max-w-[250px] break-words">
                                {plan.network}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        <span className="text-[14px] font-extrabold text-[#A70123] rounded-[7px] px-2 ">
                          {plan.coverage}
                        </span>
                      </div> */}

                      <div
                        className="rounded-2xl p-5 shadow-sm border border-gray-100 bg-[#F1F8FE] hover:bg-[#FFF2E0] transition-all duration-300 flex flex-col justify-between cursor-pointer group dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <div className="flex justify-between">
                          <h3 className="text-2xl font-[400px] mb-6">
                            ${plan.finalPrice.toFixed(2)}
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
              ) : (
                <p className="text-[20px]">{t("noPlans")}</p>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Plan Details Modal */}
      <PlanDetailsModal
        selectedPlan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onBuy={handleBuy}
        orderLoading={orderLoading}
        isLoggedIn={!!userProfile}
        onFavoriteChange={(isFavorite, plan) => {
          setPlansList((prev) =>
            prev.map((item) =>
              item._id === plan._id
                ? { ...item, wishlisted: isFavorite }
                : item,
            ),
          );
          setSelectedPlan((prev) =>
            prev && prev._id === plan._id
              ? { ...prev, wishlisted: isFavorite }
              : prev,
          );
        }}
      />
    </section>
  );
}
