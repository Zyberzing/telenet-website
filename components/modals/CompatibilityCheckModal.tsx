"use client";

import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getMobileCompanyModelList } from "@/services/deviceCompatibility";
import { Check, ChevronsUpDown, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CompatibilityCheckModalProps {
  open: boolean;
  selectedPlan: Plan | null;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}

export default function CompatibilityCheckModal({
  open,
  selectedPlan,
  onBack,
  onClose,
  onNext,
}: CompatibilityCheckModalProps) {
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [openBrand, setOpenBrand] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [brandLoading, setBrandLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  const resetForm = () => {
    setBrand("");
    setModel("");
    setOpenBrand(false);
    setOpenModel(false);
    setBrandOptions([]);
    setModelOptions([]);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const loadBrands = async () => {
    setBrandLoading(true);
    try {
      const companies = await getMobileCompanyModelList({
        usedFor: "companyName",
      });

      setBrandOptions(companies);
    } catch (error) {
      toast.error((error as Error)?.message || "Unable to fetch brands.");
    } finally {
      setBrandLoading(false);
    }
  };

  const loadModels = async (companyName: string) => {
    if (!companyName) {
      setModelOptions([]);
      return;
    }

    setModelLoading(true);
    try {
      const models = await getMobileCompanyModelList({
        usedFor: "model",
        companyName,
      });
      setModelOptions(models);
    } catch (error) {
      toast.error((error as Error)?.message || "Unable to fetch models.");
    } finally {
      setModelLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void loadBrands();
  }, [open]);

  const canProceed = brand.trim().length > 0 && model.trim().length > 0;

  const handleNextClick = () => {
    if (!canProceed) {
      toast.error("Please provide valid device details before continuing.");
      return;
    }

    onNext();
  };

  if (!selectedPlan) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!nextOpen ? onBack() : null)}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-lg overflow-hidden border-0 text-zinc-900 dark:text-zinc-50"
      >
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <div>
            <DialogTitle className="text-lg font-[400]">
              Compatibility Check
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedPlan.package_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-3xl -mt-2 font-[400px] cursor-pointer self-start"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-3 border border-primary/30 rounded-xl p-3 bg-[#F1F8FE] dark:bg-zinc-900/50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[15px] font-medium">Device Compatibility</p>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Auto-detected from your device. Check before buying.
                </p> */}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  setBrand("");
                  setModel("");
                  setModelOptions([]);
                  await loadBrands();
                }}
                disabled={brandLoading || modelLoading}
                className="h-8 px-3 text-xs bg-white dark:bg-zinc-900"
              >
                <RefreshCcw className="w-4 h-4 text-primary" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">
                  Brand
                </label>
                <Popover
                  modal={true}
                  open={openBrand}
                  onOpenChange={setOpenBrand}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={brandLoading}
                      className={cn(
                        "w-full justify-between bg-white dark:bg-zinc-900 mt-1",
                        !brand && "text-muted-foreground",
                      )}
                    >
                      {brand || (brandLoading ? "Loading..." : "Select brand")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command>
                      <CommandInput placeholder="Search brand..." />
                      <CommandEmpty>No brand found.</CommandEmpty>
                      <CommandGroup className="max-h-[220px] overflow-auto">
                        {brandOptions.map((item) => (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={() => {
                              setBrand(item);
                              setModel("");
                              setOpenBrand(false);
                              void loadModels(item);
                            }}
                          >
                            {item}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                brand === item ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-300">
                  Model
                </label>
                <Popover
                  modal={true}
                  open={openModel}
                  onOpenChange={setOpenModel}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!brand || modelLoading}
                      className={cn(
                        "w-full justify-between bg-white dark:bg-zinc-900 mt-1",
                        !model && "text-muted-foreground",
                      )}
                    >
                      {model ||
                        (!brand
                          ? "Select brand first"
                          : modelLoading
                            ? "Loading..."
                            : "Select model")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command>
                      <CommandInput placeholder="Search model..." />
                      <CommandEmpty>No model found.</CommandEmpty>
                      <CommandGroup className="max-h-[220px] overflow-auto">
                        {modelOptions.map((item) => (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={() => {
                              setModel(item);
                              setOpenModel(false);
                            }}
                          >
                            {item}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                model === item ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {/* <div className="rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-2 text-sm">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Platform
              </p>
              <p className="font-medium">{platform || "-"}</p>
            </div> */}

            {/* <div>
              <label className="text-xs text-gray-600 dark:text-gray-300">
                IMEI (Optional)
              </label>
              <Input
                value={imei}
                onChange={(e) => {
                  setImei(e.target.value.replace(/[^\d]/g, ""));
                  setCompatibilityResult(null);
                }}
                maxLength={15}
                inputMode="numeric"
                placeholder="IMEI (Optional)"
                className="bg-white dark:bg-zinc-900 mt-1"
              />
              {!isImeiValid && (
                <p className="text-[11px] text-red-500 mt-1">
                  IMEI must be exactly 15 digits.
                </p>
              )}
            </div> */}

            {/* <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-white dark:bg-zinc-800 text-[#565656] dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                GSDM database
              </span>
              <span className="px-2 py-1 rounded-full bg-white dark:bg-zinc-800 text-[#565656] dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                Provider APIs
              </span>
            </div> */}

            {/* <Button
              type="button"
              onClick={handleCompatibilityCheck}
              disabled={!canCheckCompatibility}
              className="rounded-full w-full bg-gradient"
            >
              Check Compatibility
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {["Supported", "Not Supported", "Partial Support"].map((item) => {
                const isActive = compatibilityResult === item;
                return (
                  <div
                    key={item}
                    className={`rounded-lg px-2 py-2 text-center border ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    {item}
                  </div>
                );
              })}
            </div> */}

            {/* {compatibilityResult && (
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Result:{" "}
                <span className="font-medium">{compatibilityResult}</span>
              </p>
            )} */}
          </div>
        </div>

        <DialogFooter className="p-4 rounded-b-2xl flex gap-2 sticky bottom-0 z-10">
          <Button
            onClick={onBack}
            className="bg-black dark:bg-zinc-700 flex-1 text-white hover:bg-gradient rounded-full px-4 py-2 text-sm"
          >
            Back
          </Button>
          <LoadingButton
            onClick={handleNextClick}
            disabled={!canProceed}
            loading={false}
            label="Next"
            className="bg-gradient cursor-pointer flex-1 text-white rounded-full px-4 py-2 text-sm"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
