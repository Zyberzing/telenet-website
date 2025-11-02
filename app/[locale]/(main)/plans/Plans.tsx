"use client";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRightIcon,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

type Plan = {
  price: number;
  data: string;
  validity: string;
  tag: string;
  tag2: string;
  color: string;
  // markup: number;
  // tax: number;
  // total: number;
};

type PlansProps = {
  countries: { code: string; name: string }[];
  regions: { name: string }[];
  plans: Plan[];
  selectedCountry: string;
  selectedRegion: string;
  setSelectedCountry: (val: string) => void;
  setSelectedRegion: (val: string) => void;
};

export default function Plans({
  countries,
  regions,
  plans: initialPlans = [],
  selectedCountry,
  selectedRegion,
  setSelectedCountry,
  setSelectedRegion,
}: PlansProps) {
  const t = useTranslations("Plans");
  const plans = initialPlans;
  const [validity, setValidity] = useState("7 days");
  const [network, setNetwork] = useState("5G");
  const [provider, setProvider] = useState("5G");
  const [dataSize, setDataSize] = useState([50]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

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

            {/* Dropdowns */}
            <Dropdown
              label={t("country")}
              value={selectedCountry}
              setValue={setSelectedCountry}
              // items={countries}
              items={countries.map((c) => ({
                label: c.name,
                value: c.name,
              }))}
            />
            <Dropdown
              label={t("region")}
              value={selectedRegion}
              setValue={setSelectedRegion}
              items={regions.map((r) => ({
                label: r.name,
                value: r.name,
              }))}
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

            <Dropdown
              label={t("validity")}
              value={validity}
              setValue={setValidity}
              items={[
                { label: "7 days", value: "7" },
                { label: "30 days", value: "30" },
                { label: "90 days", value: "90" },
                { label: "365 days", value: "365" },
              ]}
            />
            <Dropdown
              label={t("priceRange")}
              value="$0"
              setValue={() => {}}
              items={[
                { label: "$0", value: "0" },
                { label: "$20", value: "20" },
                { label: "$50", value: "50" },
                { label: "$100", value: "100" },
              ]}
            />
            <Dropdown
              label={t("network")}
              value={network}
              setValue={setNetwork}
              items={[
                { label: "4G", value: "4G" },
                { label: "5G", value: "5G" },
              ]}
            />
            <Dropdown
              label={t("provider")}
              value={provider}
              setValue={setProvider}
              items={[
                { label: "4G", value: "4G" },
                { label: "5G", value: "5G" },
              ]}
            />

            <Button
              variant="outline"
              className="mt-6 w-full font-medium text-sm"
            >
              {t("reset")}
            </Button>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-4">
            <h1 className="text-start text-2xl md:text-3xl font-[400px] mb-6">
              {t("popularPlans")}
            </h1>

            {/* Filter Buttons + Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  t("filters.cheapest"),
                  t("filters.mostPopular"),
                  t("filters.fiveGPlans"),
                  t("filters.yearly"),
                  t("filters.daily"),
                ].map((filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    className="rounded-full text-xs font-medium border-gray-300 hover:bg-purple-100 hover:text-purple-600"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full sm:w-[240px] text-sm"
              />
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.length > 0 ? (
                plans.map((plan, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex gap-2">
                        <span
                          className={cn(
                            "text-[14px] font-medium text-white rounded-[7px] px-2",
                            // plan.color === "orange"
                            // ? "bg-[#E49B2C]"
                            "bg-[#A22BE6]"
                          )}
                        >
                          {t("providerLogo")}
                        </span>
                        {plan.tag && (
                          <span
                            className={cn(
                              "text-[14px] font-medium text-white rounded-[7px] px-2",
                              plan?.tag === "bestSeller"
                                ? "bg-[#E49B2C]"
                                : "bg-[#9564F8]"
                            )}
                          >
                            {plan?.tag === "bestSeller"
                              ? t("bestSeller")
                              : t("trending")}
                          </span>
                        )}
                      </div>
                      {plan.tag2 && (
                        <span className="text-[14px] text-[#A70123] font-extrabold uppercase">
                          {plan.tag2}
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        "rounded-b-2xl rounded-tr-2xl rounded-tl-xs p-5 shadow-sm border border-gray-100 flex flex-col justify-between transition hover:shadow-md",
                        // plan.color === "orange"
                        //   ? "bg-[#FFF2E0]"
                        "bg-[#F1F8FE]"
                      )}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-2xl font-[400px] mb-6">
                          ${plan.price}
                        </h3>
                        <ChevronRightIcon
                          className={cn(
                            "cursor-pointer",
                            // plan.color === "orange"
                            //   ? "text-[#E49B2C]"
                            "text-primary"
                          )}
                          onClick={() => setSelectedPlan(plan)}
                        />
                      </div>

                      <div>
                        <div className="flex gap-4 text-[#5d544d]">
                          <p>{t("validity")}</p>
                          <p>{t("data")}</p>
                        </div>
                        <div className="flex gap-4">
                          <p>{plan.validity}</p>
                          <p>{plan.data}</p>
                        </div>
                      </div>

                      <Button
                        className={cn(
                          "mt-6 text-sm font-[400] rounded-full w-full",
                          // plan.color === "orange"
                          //   ? "bg-[#E49B2C]"
                          "bg-gradient"
                        )}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        {t("buy")}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-[20px]">No plans available yet.</p>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog
        open={selectedPlan !== null}
        onOpenChange={() => setSelectedPlan(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-[400]">USA 5GB, 30 Days</h2>
              <p className="text-sm text-gray-500">
                Provider: Verizon | Network: 4G/5G
              </p>
            </div>

            {/* ONLY CUSTOM CLOSE BUTTON */}
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
              <p className="text-[15px] mb-3">Plan Details</p>
              <div className="flex justify-between text-sm gap-1">
                <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-tl-xl">
                  Data
                </span>
                <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-tr-xl">
                  5 GB
                </span>
              </div>
              <div className="flex justify-between text-sm gap-1">
                <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-bl-xl">
                  Validity
                </span>
                <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-br-xl">
                  30 Days
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div>
              <p className="text-[15px] mb-3">Price Breakdown</p>
              <div className="flex justify-between text-sm gap-1">
                <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-tl-xl">
                  Price Breakdown
                </span>
                <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-tr-xl">
                  $10.00
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 ">
                  Markup
                </span>
                <span className="text-start bg-[#F1F8FE] w-full p-2 ">
                  +$1.50 (15%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-bl-xl">
                  Tax
                </span>
                <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-br-xl">
                  +$0.75
                </span>
              </div>
              <div className="flex justify-between font-[400] text-sm border border-primary rounded-xl px-3 text-center py-2 gap-1 mt-2">
                <span className="w-full text-start px-2">Total</span>
                <span className="text-start w-full px-2">$12.25</span>
              </div>
            </div>

            {/* Expiry & Notes */}
            <div className="text-xs space-y-3">
              <div>
                <p className="text-[15px] font-[400px]">Expiry Rules:</p>
                <p className="mt-2 text-[#565656] text-[13px]">
                  Plan auto-expires after 30 days or when data is used.
                </p>
              </div>
              <div>
                <p className="text-[15px] font-[400px]">Notes:</p>
                <p className="mt-2 text-[#565656] text-[13px]">
                  Refund Policy: Refunds only if plan is not activated.
                  <br />
                  Device Compatibility: Supports all eSIM-enabled iPhones &
                  Pixels.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 bg-gray-50 rounded-b-2xl flex justify-between items-center sticky bottom-0 z-10">
            <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
            <div className="flex gap-2 flex-1">
              <Button className="bg-purple-600 flex-1 text-white rounded-full px-4 py-2 text-sm">
                Buy
              </Button>
              <Button
                variant="secondary"
                className="bg-black flex-1 text-white rounded-full px-4 py-2 text-sm"
              >
                Add to Wallet
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
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
