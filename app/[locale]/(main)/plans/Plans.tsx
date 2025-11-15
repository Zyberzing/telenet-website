"use client";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { createOrder } from "@/services/order";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  ArrowDownUp,
  Calendar,
  ChevronDown,
  ChevronRightIcon,
  Heart,
  MessageCircleMore,
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { User } from "../profile-setting/ProfileSetting";

export type Plan = {
  package_id: string;
  package_name: string;
  data: string;
  validity: number;
  coverage: string;
  price: number;
  tax?: number;
  call: number;
  sms: number;
  finalPrice: number;
  network: string;
  fup_policy: string | null;
  providerName: string;
  countries: { countryname: string; countryiso2: string }[];
  actionType: "increase" | "decrease";
  markupType: "percentage" | "fixed";
  markupValue: number;
  percentage: number;
};

export interface PlansProps {
  countries: { iso2: string; code: string; name: string }[];
  regions: { name: string }[];
  plans: Plan[];
  selectedCountry: string;
  selectedRegion: string;
  filterby: "Country" | "Region";
  planType: number;
  userProfile: User | null;
}

export type orderDetails = {
  packageData: Plan;
  country: string;
  firstName: string;
  lastName: string;
  address?: string;
  email: string;
  total: number;
  device: "webapp";
};

export default function Plans({
  countries,
  regions,
  plans = [],
  selectedCountry,
  selectedRegion,
  filterby,
  userProfile,
}: PlansProps) {
  const t = useTranslations("Plans");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [filterType, setFilterType] = useState<"country" | "region">(
    filterby === "Region" ? "region" : "country"
  );
  const [internalSelectedCountry, setInternalSelectedCountry] =
    useState(selectedCountry);
  const [internalSelectedRegion, setInternalSelectedRegion] =
    useState(selectedRegion);
  const [dataSize, setDataSize] = useState([
    Number(searchParams.get("data_size")) || 50,
  ]);
  const [isPending, startTransition] = useTransition();
  const [planType, setPlanType] = useState(
    Number(searchParams.get("plan_name")) || 1
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const selectedDataSize = dataSize?.[0] ?? 0;

  const updateUrlAndReload = ({
    newDataSize,
    newCountry,
    newRegion,
    newFilterType,
    newPlanType,
  }: {
    newDataSize?: number;
    newCountry?: string;
    newRegion?: string;
    newFilterType?: "country" | "region";
    newPlanType?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSize = newDataSize ?? selectedDataSize;
    const filter = newFilterType ?? filterType;
    const country = newCountry ?? internalSelectedCountry;
    const region = newRegion ?? internalSelectedRegion;

    params.set("filterby", filter === "country" ? "Country" : "Region");
    params.set("plan_name", (newPlanType ?? planType).toString());
    if (filter === "country") {
      params.set("country_code", country);
      params.delete("region_name");
    } else {
      params.set("region_name", region);
      params.delete("country_code");
    }

    params.set("data_size", currentSize.toString());

    startTransition(() => {
      router.replace(`?${params.toString()}`);
      router.refresh();
    });
  };

  const total = (() => {
    if (!selectedPlan) return 0;

    const price = selectedPlan.price;
    const markup =
      selectedPlan.markupType === "percentage"
        ? (price * selectedPlan.markupValue) / 100
        : selectedPlan.markupValue;

    const tax = selectedPlan.tax ?? 0;

    return price + markup + tax;
  })();

  const cleanPlan: Plan = {
    ...selectedPlan!,
    finalPrice: Number(total.toFixed(2)),
  };

  const handleBuy = async (): Promise<void> => {
    if (!userProfile) {
      toast.error("Please login first to buy.");
      return Promise.resolve();
    }

    if (!selectedPlan || orderLoading) {
      return Promise.resolve();
    }

    const fullName = userProfile.name || "Unknown";
    const [firstNameRaw, ...rest] = fullName.split(" ");
    const firstName = firstNameRaw || "Unknown";
    const lastName = rest.join(" ") || firstName;

    const orderBody: orderDetails = {
      packageData: cleanPlan,
      country: selectedCountry,
      firstName,
      lastName,
      email: userProfile.email,
      total: Number(total.toFixed(2)),
      device: "webapp",
      ...(userProfile.address && { address: userProfile.address }),
    };

    try {
      setOrderLoading(true);
      const res = await createOrder(orderBody);
      toast.success("Order successfully created!");

      setSelectedPlan(null);

      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Checkout URL not found");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        console.error(err);
      } else {
        toast.error("Failed to create order");
        console.error(err);
      }
    } finally {
      setOrderLoading(false);
    }

    return Promise.resolve();
  };

  return (
    <section className="w-full min-h-screen bg-white text-gray-900">
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
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Sidebar */}
          <aside className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden h-max">
            <div className="bg-[#E9F3FF] px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <SlidersHorizontal className="w-5 h-5 text-purple-600" />
              <h2 className="font-medium text-[15px] text-[#4A4A4A]">
                {t("filterTitle")}
              </h2>
            </div>

            <div className="p-4 space-y-4">
              {/* Radio buttons */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="filterType"
                    value="country"
                    checked={filterType === "country"}
                    onChange={() => setFilterType("country")}
                    className="accent-purple-600"
                  />
                  <span>{t("country")}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="filterType"
                    value="region"
                    checked={filterType === "region"}
                    onChange={() => setFilterType("region")}
                    className="accent-purple-600"
                  />
                  <span>{t("region")}</span>
                </label>
              </div>

              {/* COUNTRY DROPDOWN */}
              {filterType === "country" && (
                <div>
                  <div className="mt-2">
                    <Dropdown
                      label={t("country")}
                      value={internalSelectedCountry}
                      setValue={(v) => {
                        setInternalSelectedCountry(v);
                        updateUrlAndReload({
                          newCountry: v,
                          newFilterType: "country",
                        });
                      }}
                      items={countries.map((c) => ({
                        label: c.name,
                        value: c.iso2,
                      }))}
                    />
                  </div>
                </div>
              )}

              {/* REGION DROPDOWN */}
              {filterType === "region" && (
                <div>
                  <div className="mt-2">
                    <Dropdown
                      label={t("region")}
                      value={internalSelectedRegion}
                      setValue={(v) => {
                        setInternalSelectedRegion(v);
                        updateUrlAndReload({
                          newRegion: v,
                          newFilterType: "region",
                        });
                      }}
                      items={regions.map((r) => ({
                        label: r.name,
                        value: r.name,
                      }))}
                    />
                  </div>
                </div>
              )}

              <hr className="border-gray-200" />

              {/* DATA SIZE */}
              <div>
                <p className="text-[14px] font-medium text-gray-700">
                  Data Size
                </p>

                <div className="mt-2 relative">
                  <Slider
                    defaultValue={[50]}
                    value={dataSize}
                    onValueChange={(v) => {
                      setDataSize(v);
                      setShowTooltip(true);
                    }}
                    onValueCommit={(v) => {
                      updateUrlAndReload({ newDataSize: v[0] });
                      setShowTooltip(false);
                    }}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />

                  {/* Tooltip above thumb */}
                  {showTooltip && (
                    <div
                      className="absolute left-0 -top-8 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                      style={{
                        left: `${((dataSize?.[0] ?? 0) / 100) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {dataSize?.[0] ?? 0}GB
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{dataSize[0]}GB</span>
                  <span>100GB</span>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Plan Type Filter */}

              <div className="mt-2">
                <label className="text-sm font-medium">Plan Type</label>

                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="planType"
                      value="1"
                      checked={planType === 1}
                      className="accent-purple-600"
                      onChange={() => {
                        setPlanType(1);

                        updateUrlAndReload({ newPlanType: 1 });
                      }}
                    />

                    <span>Data</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="planType"
                      value="2"
                      checked={planType === 2}
                      className="accent-purple-600"
                      onChange={() => {
                        setPlanType(2);

                        updateUrlAndReload({ newPlanType: 2 });
                      }}
                    />

                    <span>Voice</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Plans */}
          <main className="lg:col-span-4">
            <h1 className="text-start text-2xl md:text-3xl font-[400px] mb-6">
              {t("popularPlans")}
            </h1>

            {isPending ? (
              <div className="lg:col-span-4 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="border rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-6 w-6" />
                        </div>
                        <div className="flex gap-3">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-5 w-12" />
                          </div>
                        </div>
                        <Skeleton className="h-10 w-full rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : plans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.package_id}>
                    <div className="flex justify-between items-center mb-1">
                      {plan?.providerName && (
                        <span className="text-[14px] capitalize font-medium text-white rounded-[7px] px-2 bg-[#A22BE6]">
                          {plan?.providerName}
                        </span>
                      )}
                      <span className="text-[14px] font-extrabold text-[#A70123] rounded-[7px] px-2 ">
                        {plan.coverage}
                      </span>
                    </div>

                    <div
                      className="rounded-2xl p-5 shadow-sm border border-gray-100 bg-[#F1F8FE] hover:shadow-md transition flex flex-col justify-between"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-2xl font-[400px] mb-6">
                          ${plan.finalPrice.toFixed(2)}
                        </h3>
                        <ChevronRightIcon className="cursor-pointer text-primary" />
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
                            {plan.validity} Days
                          </p>
                          <p className="flex gap-2 items-center">
                            <MessageCircleMore size={15} /> {plan.sms}
                          </p>
                        </div>
                      </div>

                      <Button className="mt-6 text-sm rounded-full w-full bg-gradient">
                        {t("buy")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[20px]">No plans available yet.</p>
            )}
          </main>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        {selectedPlan && (
          <DialogContent
            showCloseButton={false}
            className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden border-0"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between sticky top-0 bg-white z-10">
              <div>
                <DialogTitle className="text-lg font-[400]">
                  {selectedPlan.package_name}
                </DialogTitle>
                <p className="text-sm text-gray-500">
                  Network: {selectedPlan.coverage}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-500 hover:text-red-500 text-3xl -mt-2 font-[400px] cursor-pointer self-start"
              >
                &times;
              </button>
            </div>
            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {/* Plan Details */}
              <div>
                <p className="text-[15px] mb-3 font-[400]">Plan Details</p>
                <div className="flex justify-between text-sm gap-1 mb-1">
                  <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-tl-xl">
                    Data
                  </span>
                  <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-tr-xl">
                    {selectedPlan.data}
                  </span>
                </div>
                <div className="flex justify-between text-sm gap-1 mb-1">
                  <span className="text-[#565656] bg-[#F1F8FE] w-full p-2">
                    Validity
                  </span>
                  <span className="text-start bg-[#F1F8FE] w-full p-2">
                    {selectedPlan.validity}
                  </span>
                </div>
                <div className="flex justify-between text-sm gap-1">
                  <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-bl-xl">
                    Coverage
                  </span>
                  <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-br-xl">
                    {selectedPlan.coverage}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <p className="text-[15px] mb-3 font-[400]">Price Breakdown</p>
                <div className="flex justify-between text-sm gap-1 mb-1">
                  <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-tl-xl">
                    Base Price
                  </span>
                  <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-tr-xl">
                    ${selectedPlan.price.toFixed(2)}
                  </span>
                </div>

                {/* {adminMarkup && ( */}
                <div className="flex justify-between text-sm gap-1 mb-1">
                  <span className="text-[#565656] bg-[#F1F8FE] w-full p-2">
                    Markup
                  </span>
                  <span className="text-start bg-[#F1F8FE] w-full p-2">
                    $
                    {(selectedPlan.markupType === "percentage"
                      ? (selectedPlan.price * selectedPlan.markupValue) / 100
                      : selectedPlan.markupValue
                    ).toFixed(2)}
                    ({selectedPlan?.percentage}
                    {selectedPlan?.markupType === "percentage" ? "%" : ""})
                  </span>
                </div>
                {/* )} */}

                <div className="flex justify-between text-sm gap-1">
                  <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-bl-xl">
                    Tax
                  </span>
                  <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-br-xl">
                    ${selectedPlan?.tax?.toFixed(2) || 0}
                  </span>
                </div>
                <div className="flex justify-between font-[400] text-sm border border-primary rounded-xl px-3 text-center py-2 gap-1 mt-2">
                  <span className="w-full text-start px-2">Total</span>
                  <span className="text-start w-full px-2">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* FUP / Notes */}
              {selectedPlan.fup_policy && (
                <div>
                  <p className="text-[15px] font-medium">Expiry Rules:</p>
                  <p className="mt-2 text-[#565656] text-[13px]">
                    {selectedPlan.fup_policy}
                  </p>
                </div>
              )}

              {/* Countries */}
              <div>
                <p className="text-[15px] font-medium mb-2">Available in:</p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                  {selectedPlan.countries.map((c) => (
                    <span
                      key={c.countryiso2}
                      className="px-2 py-1 bg-gray-100 rounded-md"
                    >
                      {c.countryname}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Footer */}
            <DialogFooter className="p-4 bg-gray-50 rounded-b-2xl flex justify-between items-center sticky bottom-0 z-10">
              <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
              <div className="flex gap-2 flex-1">
                <LoadingButton
                  onClick={handleBuy}
                  loading={orderLoading}
                  label={orderLoading ? "Processing..." : "Buy"}
                  className="bg-purple-600 flex-1 text-white rounded-full px-4 py-2 text-sm"
                />
                <Button className="bg-black flex-1 text-white rounded-full px-4 py-2 text-sm">
                  Add to Wallet
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

function Dropdown({
  label,
  value,
  setValue,
  items,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  items: { label: string; value: string }[];
}) {
  const selectedLabel =
    items.find((i) => i.value === value)?.label || "Select...";

  return (
    <div className="mt-5">
      <label className="text-sm font-medium">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm flex justify-between items-center hover:border-gray-400 transition">
            <span>{selectedLabel}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-full">
          {items.map((item) => {
            const isSelected = item.value === value;
            return (
              <DropdownMenuItem
                key={item.value}
                onClick={() => setValue(item.value)}
                className={`cursor-pointer text-sm ${
                  isSelected
                    ? "bg-primary text-white hover:bg-primary"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
