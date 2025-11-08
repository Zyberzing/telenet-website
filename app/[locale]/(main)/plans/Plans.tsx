"use client";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { createOrder } from "@/services/order";
import {
  ChevronDown,
  ChevronRightIcon,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "../profile-setting/ProfileSetting";

export type Plan = {
  package_id: string;
  package_name: string;
  data: string;
  validity: number;
  coverage: string;
  price: number;
  tax: number;
  finalPrice: number;
  network: string;
  fup_policy: string | null;
  countries: { countryname: string; countryiso2: string }[];
};

export type AdminMarkup = {
  _id: string;
  markupType: "percentage" | "fixed";
  fixed: number;
  markupCategory: string;
  user: string;
  percentage: number;
  updatedAt: string;
};

export type PlansProps = {
  countries: { code: string; name: string }[];
  regions: { name: string }[];
  plans: Plan[];
  adminMarkup: AdminMarkup | null;
  selectedCountry: string;
  selectedRegion: string;
  setSelectedCountry: (val: string) => void;
  setSelectedRegion: (val: string) => void;
  userProfile: User | null;
};

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
  adminMarkup,
  selectedCountry,
  selectedRegion,
  setSelectedCountry,
  setSelectedRegion,
  userProfile,
}: PlansProps) {
  const t = useTranslations("Plans");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [dataSize, setDataSize] = useState([50]);

  const total = (() => {
    if (!selectedPlan) return 0;

    const basePrice = selectedPlan.price || 0;
    const markup =
      adminMarkup?.markupType === "percentage"
        ? (basePrice * (adminMarkup?.percentage || 0)) / 100
        : adminMarkup?.fixed || 0;

    const tax = selectedPlan.tax || 0;

    return basePrice + markup + tax;
  })();

  const cleanPlan: Plan = {
    ...selectedPlan!, // use ! because selectedPlan is guaranteed to exist here
    finalPrice: Number(total.toFixed(2)), // override only finalPrice
  };

  // inside Plans component
  const handleBuy = async () => {
    if (!userProfile) {
      toast.error("Please login first");
      return;
    }

    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    const fullName = userProfile.name || "Unknown";
    const [firstNameRaw, ...rest] = fullName.split(" ");
    const firstName = firstNameRaw || "Unknown";
    const lastName = rest.join(" ") || firstName;

    const orderBody: orderDetails = {
      packageData: cleanPlan,
      country: selectedCountry,
      firstName: firstName,
      lastName: lastName,
      email: userProfile.email,
      total: Number(total.toFixed(2)),
      device: "webapp",
      ...(userProfile.address && { address: userProfile.address }),
    };

    try {
      const res = await createOrder(orderBody);
      console.log("Order created:", res);
      toast.success("Order successfully created!");

      // ✅ Close the dialog
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
    }
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

      {/* Browse Plans Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Sidebar Filter */}
          <aside className="border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-[400] text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-purple-600" />
              {t("filterTitle")}
            </h2>

            {/* Country & Region Filters */}
            <Dropdown
              label={t("country")}
              value={selectedCountry}
              setValue={setSelectedCountry}
              items={countries.map((c) => ({ label: c.name, value: c.name }))}
            />
            <Dropdown
              label={t("region")}
              value={selectedRegion}
              setValue={setSelectedRegion}
              items={regions.map((r) => ({ label: r.name, value: r.name }))}
            />

            {/* Data Size */}
            <div className="mt-5">
              <label className="text-sm font-medium">{t("dataSize")}</label>
              <Slider
                defaultValue={[50]}
                value={dataSize}
                onValueChange={setDataSize}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>0GB</span>
                <span>{dataSize}GB</span>
                <span>100GB</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-4">
            <h1 className="text-start text-2xl md:text-3xl font-[400px] mb-6">
              {t("popularPlans")}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <div key={plan.package_id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[14px] font-medium text-white rounded-[7px] px-2 bg-[#A22BE6]">
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

                      <div className="flex gap-3">
                        <div className="gap-4">
                          <p className="text-[#5d544d]">{t("validity")}</p>
                          <p>{plan.validity} days</p>
                        </div>
                        <div className="gap-4">
                          <p className="text-[#5d544d]">{t("data")}</p>
                          <p>{plan.data}</p>
                        </div>
                      </div>

                      <Button className="mt-6 text-sm rounded-full w-full bg-gradient">
                        {t("buy")}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[20px]">No plans available yet.</p>
              )}
            </div>
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
                <h2 className="text-lg font-[400]">
                  {selectedPlan.package_name}
                </h2>
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

                {adminMarkup && (
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] w-full p-2">
                      Markup
                    </span>
                    <span className="text-start bg-[#F1F8FE] w-full p-2">
                      $
                      {(adminMarkup?.markupType === "percentage"
                        ? ((selectedPlan?.price || 0) *
                            (adminMarkup?.percentage || 0)) /
                          100
                        : adminMarkup?.fixed || 0
                      ).toFixed(2)}{" "}
                      ({adminMarkup?.percentage}
                      {adminMarkup?.markupType === "percentage" ? "%" : ""})
                    </span>
                  </div>
                )}

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
                <Button
                  onClick={handleBuy}
                  className="bg-purple-600 flex-1 text-white rounded-full px-4 py-2 text-sm"
                >
                  Buy
                </Button>
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
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setValue(item.value)}
              className="cursor-pointer text-sm"
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
