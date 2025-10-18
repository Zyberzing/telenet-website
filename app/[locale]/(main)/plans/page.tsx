"use client";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRightIcon, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

const plans = [
  {
    price: 15,
    data: "5GB",
    validity: "30 days",
    tag: "",
    tag2: "TRUE5G",
    color: "orange",
  },
  {
    price: 20,
    data: "10GB",
    validity: "30 days",
    tag: "",
    tag2: "TRUE5G",
    color: "purple",
  },
  {
    price: 10,
    data: "3GB",
    validity: "60 days",
    tag: "trending",
    tag2: "TRUE5G",
    color: "purple",
  },
  {
    price: 18,
    data: "6GB",
    validity: "30 days",
    tag: "",
    tag2: "TRUE5G",
    color: "purple",
  },
  {
    price: 40,
    data: "20GB",
    validity: "90 days",
    tag: "bestSeller",
    tag2: "",
    color: "yellow",
  },
  {
    price: 140,
    data: "50GB",
    validity: "365 days",
    tag: "",
    tag2: "",
    color: "purple",
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
              {plans.map((plan, i) => (
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
