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
  basePrice: number;
  markup: number;
  tax: number;
  total: number;
};

const plans: Plan[] = [
  {
    price: 15,
    data: "5GB",
    validity: "30 days",
    tag: "",
    tag2: "TRUE5G",
    color: "orange",
    basePrice: 10.0,
    markup: 1.5,
    tax: 0.75,
    total: 12.25,
  },
  {
    price: 20,
    data: "10GB",
    validity: "30 days",
    tag: "",
    tag2: "TRUE5G",
    color: "purple",
    basePrice: 15.0,
    markup: 2.0,
    tax: 1.0,
    total: 18.0,
  },
  {
    price: 10,
    data: "3GB",
    validity: "60 days",
    tag: "trending",
    tag2: "TRUE5G",
    color: "purple",
    basePrice: 8.0,
    markup: 1.0,
    tax: 0.5,
    total: 9.5,
  },
  {
    price: 18,
    data: "6GB",
    validity: "30 days",
    tag: "",
    tag2: "TRUE5G",
    color: "purple",
    basePrice: 14.0,
    markup: 1.5,
    tax: 0.75,
    total: 16.25,
  },
  {
    price: 40,
    data: "20GB",
    validity: "90 days",
    tag: "bestSeller",
    tag2: "",
    color: "yellow",
    basePrice: 35.0,
    markup: 2.5,
    tax: 1.25,
    total: 38.75,
  },
  {
    price: 140,
    data: "50GB",
    validity: "365 days",
    tag: "",
    tag2: "",
    color: "purple",
    basePrice: 130.0,
    markup: 5.0,
    tax: 2.5,
    total: 137.5,
  },
];

export default function Plans() {
  const t = useTranslations("Plans");
  const [country, setCountry] = useState("United States");
  const [region, setRegion] = useState("West");
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
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-purple-600" />
              {t("filterTitle")}
            </h2>

            {/* Dropdowns */}
            <Dropdown
              label={t("country")}
              value={country}
              setValue={setCountry}
              items={[
                t("countries.us"),
                t("countries.uk"),
                t("countries.ca"),
                t("countries.au"),
              ]}
            />
            <Dropdown
              label={t("region")}
              value={region}
              setValue={setRegion}
              items={[
                t("regions.west"),
                t("regions.east"),
                t("regions.north"),
                t("regions.south"),
              ]}
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
              items={["7 days", "30 days", "90 days", "365 days"]}
            />
            <Dropdown
              label={t("priceRange")}
              value="$0"
              setValue={() => {}}
              items={["$0", "$20", "$50", "$100"]}
            />
            <Dropdown
              label={t("network")}
              value={network}
              setValue={setNetwork}
              items={["4G", "5G"]}
            />
            <Dropdown
              label={t("provider")}
              value={provider}
              setValue={setProvider}
              items={["4G", "5G"]}
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
              {plans.map((plan: Plan, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex gap-2">
                      <span
                        className={cn(
                          "text-[14px] font-medium text-white rounded-[7px] px-2",
                          plan.color === "orange"
                            ? "bg-[#E49B2C]"
                            : "bg-[#A22BE6]"
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
                      plan.color === "orange" ? "bg-[#FFF2E0]" : "bg-[#F1F8FE]"
                    )}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-2xl font-[400px] mb-6">
                        ${plan.price}
                      </h3>
                      <ChevronRightIcon
                        className={cn(
                          "cursor-pointer",
                          plan.color === "orange"
                            ? "text-[#E49B2C]"
                            : "text-primary"
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
                        "mt-6 text-sm font-semibold rounded-full w-full",
                        plan.color === "orange" ? "bg-[#E49B2C]" : "bg-gradient"
                      )}
                    >
                      {t("buy")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog
        open={selectedPlan !== null}
        onOpenChange={() => setSelectedPlan(null)}
      >
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-semibold">USA 5GB, 30 Days</h2>
              <p className="text-sm text-gray-500">
                Provider: Verizon | Network: 4G/5G
              </p>
            </div>

            {/* ONLY CUSTOM CLOSE BUTTON */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-gray-500 hover:text-red-500 text-3xl font-[400px]"
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
              <div className="flex justify-between font-semibold text-sm border border-primary rounded-xl px-3 text-center py-2 gap-1 mt-2">
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
  items: string[];
}) {
  return (
    <div className="mt-5">
      <label className="text-sm font-medium">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm flex justify-between items-center hover:border-gray-400 transition">
            <span>{value}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {items.map((item) => (
            <DropdownMenuItem
              key={item}
              onClick={() => setValue(item)}
              className="cursor-pointer text-sm"
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
