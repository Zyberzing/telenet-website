"use client";

import { useCurrency } from "@/app/providers/CurrencyProvider";
import { PlanDetailsModal } from "@/components/modals";
import { PlanFilters } from "@/components/plans";
import { PlanCardSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/Button";
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
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

const DEFAULT_DATA_SIZE = 50;

const toPositiveInt = (value: string | null | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const toOptionalPositiveInt = (value: string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
};

export default function Plans({
  countries,
  regions,
  result = [],
  pagination,
  selectedCountry,
  selectedRegion,
  filterby,
  planType: initialPlanType,
  userProfile,
}: PlansProps) {
  const t = useTranslations("Plans");
  const { formatAmount } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const sidebarContainerRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const urlFilterBy =
    searchParams.get("filterby") === "Region"
      ? "region"
      : filterby === "Region"
        ? "region"
        : "country";
  const urlCountry = searchParams.get("country_code") ?? selectedCountry ?? "";
  const urlRegion = searchParams.get("region_name") ?? selectedRegion ?? "";
  const urlPage = toPositiveInt(
    searchParams.get("page"),
    pagination?.currentPage ?? 1,
  );
  const urlDataSize = Number(searchParams.get("data_size") ?? 50);
  const urlMinValidity = toOptionalPositiveInt(
    searchParams.get("min_validity"),
  );
  const urlMaxValidity = toOptionalPositiveInt(
    searchParams.get("max_validity"),
  );
  const urlPlanType = Number(
    searchParams.get("plan_name") ?? initialPlanType ?? 1,
  );

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
  const [minValidity, setMinValidity] = useState(urlMinValidity);
  const [maxValidity, setMaxValidity] = useState(urlMaxValidity);
  const [isPending, startTransition] = useTransition();
  const [planType, setPlanType] = useState(
    Number(searchParams.get("plan_name")) || initialPlanType || 1,
  );
  const [isDesktop, setIsDesktop] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState<number | null>(null);

  const smoothScrollToTop = () => {
    listContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setPlansList(result);
  }, [result]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    smoothScrollToTop();
  }, [pagination?.currentPage, result.length]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const hasFilter = Boolean(searchParams.get("filterby"));
    const hasDataSize = Boolean(searchParams.get("data_size"));
    const hasPlanType = Boolean(searchParams.get("plan_name"));
    const hasCountry = Boolean(searchParams.get("country_code"));
    const hasRegion = Boolean(searchParams.get("region_name"));
    const hasPage = Boolean(searchParams.get("page"));

    const needsCountryDefaults =
      urlFilterBy === "country" && (!hasCountry || !hasFilter);
    const needsRegionDefaults =
      urlFilterBy === "region" && (!hasRegion || !hasFilter);
    const needsBaseDefaults = !hasDataSize || !hasPlanType || !hasPage;

    if (!needsCountryDefaults && !needsRegionDefaults && !needsBaseDefaults) {
      return;
    }

    params.set("filterby", urlFilterBy === "country" ? "Country" : "Region");
    params.set("data_size", String(urlDataSize || DEFAULT_DATA_SIZE));
    params.set("page", String(urlPage || 1));
    params.set("plan_name", String(urlPlanType || 1));

    if (typeof urlMinValidity === "number" && urlMinValidity > 0) {
      params.set("min_validity", String(urlMinValidity));
    } else {
      params.delete("min_validity");
    }

    if (typeof urlMaxValidity === "number" && urlMaxValidity > 0) {
      params.set("max_validity", String(urlMaxValidity));
    } else {
      params.delete("max_validity");
    }

    if (urlFilterBy === "country" && urlCountry) {
      params.set("country_code", urlCountry);
      params.delete("region_name");
    }

    if (urlFilterBy === "region" && urlRegion) {
      params.set("region_name", urlRegion);
      params.delete("country_code");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [
    router,
    searchParams,
    urlCountry,
    urlDataSize,
    urlFilterBy,
    urlMaxValidity,
    urlMinValidity,
    urlPage,
    urlPlanType,
    urlRegion,
  ]);

  useEffect(() => {
    setFilterType(urlFilterBy);
    setInternalSelectedCountry(urlCountry);
    setInternalSelectedRegion(urlRegion);
    setDataSize([urlDataSize]);
    setMinValidity(urlMinValidity);
    setMaxValidity(urlMaxValidity);
    setPlanType(urlPlanType);
  }, [
    urlFilterBy,
    urlCountry,
    urlDataSize,
    urlRegion,
    urlMinValidity,
    urlMaxValidity,
    urlPlanType,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setSidebarHeight(null);
      return;
    }

    const sidebarEl = sidebarContainerRef.current;
    if (!sidebarEl) {
      return;
    }

    const updateSidebarHeight = () => {
      setSidebarHeight(Math.ceil(sidebarEl.getBoundingClientRect().height));
    };

    updateSidebarHeight();
    const observer = new ResizeObserver(updateSidebarHeight);
    observer.observe(sidebarEl);

    return () => observer.disconnect();
  }, [isDesktop]);

  const updateUrlAndReload = ({
    newDataSize,
    newMinValidity,
    newMaxValidity,
    newCountry,
    newRegion,
    newFilterType,
    newPlanType,
    newPage,
  }: {
    newDataSize?: number;
    newMinValidity?: number;
    newMaxValidity?: number;
    newCountry?: string;
    newRegion?: string;
    newFilterType?: "country" | "region";
    newPlanType?: number;
    newPage?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const filter = newFilterType ?? filterType;
    const dataSizeValue = newDataSize ?? dataSize[0] ?? DEFAULT_DATA_SIZE;
    const minValidityValue = newMinValidity ?? minValidity;
    const maxValidityValue = newMaxValidity ?? maxValidity;
    const country = newCountry ?? internalSelectedCountry;
    const region = newRegion ?? internalSelectedRegion;
    const page = newPage ?? 1;

    params.set("filterby", filter === "country" ? "Country" : "Region");
    params.set("plan_name", (newPlanType ?? planType).toString());
    params.set("data_size", String(dataSizeValue));
    params.set("page", page.toString());

    if (typeof minValidityValue === "number" && minValidityValue > 0) {
      params.set("min_validity", minValidityValue.toString());
    } else {
      params.delete("min_validity");
    }

    if (typeof maxValidityValue === "number" && maxValidityValue > 0) {
      params.set("max_validity", maxValidityValue.toString());
    } else {
      params.delete("max_validity");
    }

    params.delete("country_code");
    params.delete("region_name");

    if (filter === "country" && country) {
      params.set("country_code", country);
    }

    if (filter === "region" && region) {
      params.set("region_name", region);
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || urlPage;

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
    <section className="w-full min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 lg:h-full lg:min-h-0 lg:flex lg:flex-col lg:overflow-hidden">
      <div className="relative w-full h-[22.6vh] lg:flex-shrink-0">
        <Image
          src="/banner-plans.svg"
          alt={t("bannerAlt")}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:flex-1 lg:min-h-0 lg:box-border lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:h-full lg:overflow-hidden">
          <div ref={sidebarContainerRef} className="lg:self-start">
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
              minValidity={minValidity}
              onMinValidityChange={setMinValidity}
              onMinValidityCommit={(v) => {
                updateUrlAndReload({ newMinValidity: v });
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
          </div>

          <main className="lg:col-span-4 lg:h-full lg:min-h-0">
            <div
              className="pb-6 lg:h-full lg:flex lg:flex-col lg:min-h-0"
              style={
                isDesktop && sidebarHeight
                  ? { height: `${sidebarHeight}px` }
                  : undefined
              }
            >
              <h1 className="text-start text-2xl md:text-3xl font-[400px] mb-6 sticky top-0 bg-white z-10 pb-2 dark:bg-gray-900">
                {t("popularPlans")}
              </h1>
              <div
                ref={listContainerRef}
                className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-2 scrollbar-thin"
              >
                {isPending ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <PlanCardSkeleton key={i} />
                    ))}
                  </div>
                ) : plansList.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {plansList.map((plan) => (
                        <div key={plan.package_id}>
                          <div
                            className="rounded-2xl p-5 shadow-sm border border-gray-100 bg-[#F1F8FE] hover:bg-[#FFF2E0] transition-all duration-300 flex flex-col justify-between cursor-pointer group dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            <div className="flex justify-between">
                              <h3 className="text-2xl font-[400px] mb-6">
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
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          onClick={() =>
                            updateUrlAndReload({ newPage: currentPage - 1 })
                          }
                          disabled={currentPage <= 1 || isPending}
                        >
                          Prev
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              onClick={() =>
                                updateUrlAndReload({ newPage: page })
                              }
                              disabled={isPending}
                            >
                              {page}
                            </Button>
                          ),
                        )}
                        <Button
                          variant="outline"
                          onClick={() =>
                            updateUrlAndReload({ newPage: currentPage + 1 })
                          }
                          disabled={currentPage >= totalPages || isPending}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-[20px]">{t("noPlans")}</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

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
