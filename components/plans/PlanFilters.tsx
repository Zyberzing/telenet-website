"use client";

import { Slider } from "@/components/ui/slider";
import { Check, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
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
import { cn } from "@/lib/utils";

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
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full mt-1 justify-between text-sm font-normal"
          >
            {selectedLabel}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
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
  planType,
  onPlanTypeChange,
  countryLabel,
  regionLabel,
  filterTitle,
}: PlanFiltersProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <aside className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden h-fit lg:sticky lg:top-4">
      <div className="bg-[#E9F3FF] px-4 py-3 flex items-center gap-2 border-b border-gray-200">
        <SlidersHorizontal className="w-5 h-5 text-purple-600" />
        <h2 className="font-medium text-[15px] text-[#4A4A4A]">
          {filterTitle}
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
            <span>Country</span>
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

        <hr className="border-gray-200" />

        {/* DATA SIZE */}
        <div>
          <p className="text-[14px] font-medium text-gray-700">Data Size</p>

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
                onChange={() => onPlanTypeChange(1)}
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
                onChange={() => onPlanTypeChange(2)}
              />
              <span>Voice</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
