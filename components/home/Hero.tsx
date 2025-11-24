"use client";

import { getCountries, getRegions } from "@/services/plansApi";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from "../ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";

export default function Hero() {
  const t = useTranslations("Hero");
  const router = useRouter();
  const locale = useLocale();

  const [travelType, setTravelType] = useState<"country" | "region">("country");
  const [options, setOptions] = useState<
    { id: string; name: string; iso2?: string }[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<{
    id: string;
    name: string;
    iso2?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const response =
          travelType === "country" ? await getCountries() : await getRegions();
        setOptions(response || []);
      } catch (err) {
        console.error("Error fetching options:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
    setSelectedOption(null);
  }, [travelType]);

  const handleBrowse = () => {
    if (!selectedOption) return;

    const filterBy = travelType === "country" ? "Country" : "Region";
    let url = `/${locale}/plans?filterby=${filterBy}`;

    if (travelType === "country" && selectedOption.iso2) {
      url += `&country_code=${encodeURIComponent(selectedOption.iso2)}`;
    } else if (travelType === "region") {
      url += `&region_name=${encodeURIComponent(selectedOption.name)}`;
    }

    router.push(url);
  };

  return (
    <section className="w-full bg-[url(/grid.svg)] bg-center bg-cover bg-no-repeat">
      <div className="text-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Rating */}
        <div className="px-4 py-1 inline-flex items-center rounded-full text-xs sm:text-sm mb-4 border border-primary bg-white">
          <div className="flex items-center gap-0.5 text-yellow-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt />
          </div>
          <span className="ml-2 text-black">{t("rating")}</span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-[400] mb-3 
             text-gray-900 dark:text-white leading-snug"
        >
          {t("title")}{" "}
          <span className="text-primary dark:text-primary">
            {t("titleHighlight")}
          </span>{" "}
          {t("titleCountries")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-black mb-6 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>

        {/* CTA Button */}
        <Button
          variant="default"
          size="lg"
          onClick={() => router.push(ROUTES.PLANS(locale))}
          className="mb-10 px-5 py-2 bg-gradient hover:bg-primary rounded-3xl text-xs sm:text-sm md:text-base"
        >
          {t("getStarted")}
          <span className="ml-2 rounded-full p-1 bg-white text-black">
            <IoIosArrowForward />
          </span>
        </Button>

        {/* Travel Section */}
        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 px-5 sm:px-8 rounded-4xl">
          {/* Decorative Backgrounds (non-interactive) */}
          <div className="absolute w-full h-20 left-0 -bottom-6 bg-gradient-two blur-[150px] pointer-events-none" />
          <div className="absolute inset-0 bg-[url(/dots.svg)] bg-center bg-cover bg-no-repeat rounded-4xl pointer-events-none" />
          <svg className="absolute w-full h-full rounded-4xl pointer-events-none">
            <defs>
              <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
                <path
                  d="
                    M0.06,0
                    Q0.05,0,0.04,0.02
                    L0.015,0.07
                    Q0,0.09,0,0.12
                    L0,1
                    L1,1
                    L1,0
                    Z
                  "
                />
              </clipPath>
            </defs>
          </svg>
          <div
            className="absolute inset-0 bg-gradient z-0 rounded-4xl pointer-events-none"
            style={{ clipPath: "url(#hero-clip)" }}
          />

          {/* Left Side */}
          <div className="relative z-10 text-white w-full lg:w-1/2 text-start ml-0 sm:ml-[25px] py-[50px]">
            <h2 className="text-base pt-[50px] md:pt-[40px] lg:pt-0 sm:pt-0 sm:text-lg md:text-3xl font-medium mb-4">
              {t("likeTravel")}
            </h2>

            {/* Radio buttons */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm md:text-base mb-5">
              {[
                { key: "country", label: t("country") },
                { key: "region", label: t("region") },
              ].map((type) => (
                <label
                  key={type.key}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() =>
                    setTravelType(type.key as "country" | "region")
                  }
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                      travelType === type.key
                        ? "bg-white text-primary border-white"
                        : "border-white"
                    }`}
                  >
                    {travelType === type.key && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="capitalize">{type.label}</span>
                </label>
              ))}
            </div>

            {/* Shadcn Dropdown */}
            <div className="flex gap-3 sm:gap-4 mb-5 bg-[#B882DB] p-2 sm:p-3 rounded-[40px] w-full">
              <div className="flex items-center w-full p-2 px-3 sm:px-4 bg-white rounded-3xl shadow-sm">
                <FaLocationDot className="text-primary mr-2 sm:mr-3" />

                {loading ? (
                  <span className="text-gray-500 text-sm flex gap-2 items-center">
                    <FaSpinner className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="w-full text-left text-black text-xs sm:text-sm md:text-base focus:outline-none"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        {selectedOption
                          ? selectedOption.name
                          : t("searchPlaceholder")}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                      <Command>
                        <CommandInput placeholder="Search..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {options.map((opt) => {
                              const isSelected = selectedOption?.id === opt.id;
                              return (
                                <CommandItem
                                  key={opt.id}
                                  value={opt.name}
                                  onSelect={() => {
                                    setSelectedOption(opt);
                                    setDropdownOpen(false);
                                  }}
                                  className={cn(
                                    isSelected && "bg-gradient text-white!"
                                  )}
                                >
                                  {opt.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      isSelected
                                        ? "opacity-100 text-white"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <span
                onClick={selectedOption ? handleBrowse : undefined}
                className={`flex items-center justify-center rounded-full p-3 sm:p-4 transition ${
                  selectedOption
                    ? "cursor-pointer bg-gradient text-white hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={
                  selectedOption
                    ? "Search plans"
                    : "Select a country or region first"
                }
              >
                <FaMagnifyingGlass className="text-sm sm:text-base md:text-lg" />
              </span>
            </div>

            {/* Browse Plans */}
            <button
              onClick={handleBrowse}
              disabled={!selectedOption}
              className={`w-full sm:w-auto px-5 font-[400] py-2 sm:py-3 rounded-3xl flex items-center justify-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm md:text-base transition ${
                selectedOption
                  ? "bg-white text-black hover:bg-gray-100 cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {t("browsePlans")}
              <span className="ml-1 sm:ml-2 rounded-full p-1 bg-primary text-white">
                <IoIosArrowForward fontSize={18} />
              </span>
            </button>
          </div>

          {/* Right Side */}
          <div className="relative z-10 w-full lg:w-1/2 flex justify-center hidden lg:flex">
            <div className="absolute -top-10 sm:-top-16 md:-top-[20em] lg:-top-[13.3em] xl:-top-[14.4em]">
              <Image
                src="/home-hero-banner.png"
                alt="Man using phone"
                width={350}
                height={400}
                className="object-cover max-h-[300px] sm:max-h-[350px] md:max-h-[400px] w-auto"
              />
              {/* Country Flag Cards */}
              <div className="absolute top-[11rem] right-[0rem] rounded-b-md bg-white shadow-md flex flex-col items-center w-[70px]">
                <Image
                  src="/flags/usa.svg"
                  alt="USA flag"
                  width={100}
                  height={35}
                />
                <span className="text-[11px] my-[2px] leading-[1.1] text-center">
                  United States
                  <br />
                  of America
                </span>
              </div>

              <div className="absolute bottom-[7rem] -left-[0.8rem] bg-white rounded-b-md shadow-md flex flex-col items-center w-[70px]">
                <Image
                  src="/flags/uae.svg"
                  alt="UAE flag"
                  width={100}
                  height={35}
                />
                <span className="text-[11px] text-gray-700 font-medium my-[2px] leading-[1.1] text-center">
                  United Arab
                  <br />
                  Emirates
                </span>
              </div>

              <div className="absolute bottom-[3.2rem] right-[2rem] bg-white rounded-b-md shadow-md flex flex-col items-center w-[70px]">
                <Image
                  src="/flags/uk.svg"
                  alt="UK flag"
                  width={100}
                  height={35}
                />
                <span className="text-[11px] text-gray-700 font-medium my-[2px] leading-[1.1] text-center">
                  United
                  <br />
                  Kingdom
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
