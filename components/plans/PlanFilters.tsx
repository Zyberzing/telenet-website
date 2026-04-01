"use client";

import { Button } from "@/components/ui/Button";
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
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterDropdownProps {
  label: string;
  value: string;
  setValue: (v: string) => void;
  items: { label: string; value: string }[];
}

function FilterDropdown({
  label,
  value,
  setValue,
  items,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    items.find((i) => i.value === value)?.label || "Select...";

  return (
    <div className="mt-5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full mt-1 flex justify-between items-center text-sm font-normal text-left min-h-[42px]"
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder={`Search...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      setValue(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      value === item.value && "bg-gradient text-white"
                    )}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value
                          ? "opacity-100 text-white"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface PlanFiltersProps {
  filterType: "country" | "region";
  setFilterType: (type: "country" | "region") => void;
  countries: { label: string; value: string }[];
  regions: { label: string; value: string }[];
  selectedCountry: string;
  selectedRegion: string;
  onCountryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  dataSize: number[];
  onDataSizeChange: (value: number[]) => void;
  onDataSizeCommit: (value: number[]) => void;
  minValidity?: number;
  onMinValidityChange: (value: number | undefined) => void;
  onMinValidityCommit: (value: number | undefined) => void;
  maxValidity?: number;
  onMaxValidityChange: (value: number | undefined) => void;
  onMaxValidityCommit: (value: number | undefined) => void;
  planType: number;
  onPlanTypeChange: (type: number) => void;
  countryLabel: string;
  regionLabel: string;
  filterTitle: string;
}

export function PlanFilters({
  filterType,
  setFilterType,
  countries,
  regions,
  selectedCountry,
  selectedRegion,
  onCountryChange,
  onRegionChange,
  dataSize,
  onDataSizeChange,
  onDataSizeCommit,
  minValidity,
  onMinValidityChange,
  onMinValidityCommit,
  maxValidity,
  onMaxValidityChange,
  onMaxValidityCommit,
  planType,
  onPlanTypeChange,
  countryLabel,
  regionLabel,
  filterTitle,
}: PlanFiltersProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const validityOptions: { label: string; value: number | undefined }[] = [
    { label: "All", value: undefined },
    { label: "1 day", value: 1 },
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "90 days", value: 90 },
    { label: "180 days", value: 180 },
    { label: "365 days", value: 365 },
  ];

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (filterType === "country") {
      if (!selectedCountry && countries.length > 0) {
        onCountryChange(countries[0]?.value || "");
      }
    }

    if (filterType === "region") {
      if (!selectedRegion && regions.length > 0) {
        onRegionChange(regions[0]?.value || "");
      }
    }
  }, [filterType, selectedCountry, selectedRegion, countries, regions]);

  return (
    <aside className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden h-fit lg:sticky lg:top-4 dark:bg-gray-900 dark:border-gray-700">
      <div className="bg-[#E9F3FF] px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <SlidersHorizontal className="w-5 h-5 text-purple-600" />
        <h2 className="font-medium text-[15px] text-[#4A4A4A] dark:text-gray-100">
          {filterTitle}
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Radio buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
            <input
              type="radio"
              name="filterType"
              value="country"
              checked={filterType === "country"}
              onChange={() => {
                setFilterType("country");
                const firstCountry = countries[0]?.value || "";
                if (firstCountry) {
                  onCountryChange(firstCountry);
                }
              }}
              className="accent-purple-600"
            />
            <span>Country</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
            <input
              type="radio"
              name="filterType"
              value="region"
              checked={filterType === "region"}
              onChange={() => {
                setFilterType("region");
                const firstRegion = regions[0]?.value || "";
                if (firstRegion) {
                  onRegionChange(firstRegion);
                }
              }}
              className="accent-purple-600"
            />
            <span>Region</span>
          </label>
        </div>

        {/* COUNTRY DROPDOWN */}
        {filterType === "country" && (
          <div>
            <div className="mt-2">
              <FilterDropdown
                label={countryLabel}
                value={selectedCountry}
                setValue={onCountryChange}
                items={countries}
              />
            </div>
          </div>
        )}

        {/* REGION DROPDOWN */}
        {filterType === "region" && (
          <div>
            <div className="mt-2">
              <FilterDropdown
                label={regionLabel}
                value={selectedRegion}
                setValue={onRegionChange}
                items={regions}
              />
            </div>
          </div>
        )}

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* DATA SIZE */}
        <div>
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-200">
            Data Size
          </p>

          <div className="mt-2 relative">
            <Slider
              defaultValue={[50]}
              value={dataSize}
              onValueChange={(v) => {
                onDataSizeChange(v);
                setShowTooltip(true);
              }}
              onValueCommit={(v) => {
                onDataSizeCommit(v);
                setShowTooltip(false);
              }}
              max={100}
              step={1}
              className="cursor-pointer"
            />

            {/* Animated Tooltip */}
            {showTooltip && (
              <div
                className="absolute -top-10 transform -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200"
                style={{
                  left: `${((dataSize?.[0] ?? 0) / 100) * 100}%`,
                }}
              >
                {dataSize?.[0] ?? 0}GB
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
              </div>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1 dark:text-gray-400">
            <span>0</span>
            <span>{dataSize[0]}GB</span>
            <span>100GB</span>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Plan Type Filter */}
        <div className="mt-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Plan Type
          </label>

          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="planType"
                value="1"
                checked={planType === 1}
                className="accent-purple-600"
                onChange={() => onPlanTypeChange(1)}
              />
              <span>Data</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="planType"
                value="2"
                checked={planType === 2}
                className="accent-purple-600"
                onChange={() => onPlanTypeChange(2)}
              />
              <span>Voice</span>
            </label>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />
        {/* MIN VALIDITY */}
        <div>
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-200">
            Min Validity (days)
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-2 flex justify-between items-center text-sm font-normal text-left min-h-[42px]"
              >
                <span className="truncate">
                  {typeof minValidity === "number"
                    ? `${minValidity} days`
                    : "Select validity..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {validityOptions.map((item) => (
                      <CommandItem
                        key={item.label}
                        value={
                          typeof item.value === "number"
                            ? item.value.toString()
                            : "all"
                        }
                        onSelect={() => {
                          onMinValidityChange(item.value);
                          onMinValidityCommit(item.value);
                        }}
                        className={cn(
                          minValidity === item.value && "bg-gradient text-white"
                        )}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            minValidity === item.value
                              ? "opacity-100 text-white"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />
        {/* MAX VALIDITY */}
        <div>
          <p className="text-[14px] font-medium text-gray-700 dark:text-gray-200">
            Max Validity (days)
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-2 flex justify-between items-center text-sm font-normal text-left min-h-[42px]"
              >
                <span className="truncate">
                  {maxValidity ? `${maxValidity} days` : "Select validity..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {validityOptions.map((item) => (
                      <CommandItem
                        key={item.label}
                        value={
                          typeof item.value === "number"
                            ? item.value.toString()
                            : "all"
                        }
                        onSelect={() => {
                          onMaxValidityChange(item.value);
                          onMaxValidityCommit(item.value);
                        }}
                        className={cn(
                          maxValidity === item.value && "bg-gradient text-white"
                        )}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            maxValidity === item.value
                              ? "opacity-100 text-white"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </aside>
  );
}
