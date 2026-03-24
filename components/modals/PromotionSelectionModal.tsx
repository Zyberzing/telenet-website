"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import { PromotionItem, PromotionSelectionModalProps } from "@/lib/types";
import { getPromotionList, verifyPromotion } from "@/services/promotion";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

export default function PromotionSelectionModal({
  open,
  selectedPlan,
  onBack,
  onClose,
  onBuy,
  orderLoading,
}: PromotionSelectionModalProps) {
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null,
  );
  const [travelStartDate, setTravelStartDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");
  const [travelDateErrors, setTravelDateErrors] = useState({
    travelStartDate: "",
    travelEndDate: "",
  });
  const [verifyingPromotionId, setVerifyingPromotionId] = useState<
    string | null
  >(null);

  const today: string = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0]!;

  useEffect(() => {
    if (!open) {
      setSelectedPromotionId(null);
      setSearch("");
      setTravelStartDate("");
      setTravelEndDate("");
      setTravelDateErrors({
        travelStartDate: "",
        travelEndDate: "",
      });
      return;
    }

    const loadPromotions = async () => {
      try {
        setLoadingPromotions(true);
        const result = await getPromotionList();
        setPromotions(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load promotions.";
        toast.error(
          message === "Token missing" || message === "Token expired"
            ? "Please login first."
            : message,
        );
        setPromotions([]);
      } finally {
        setLoadingPromotions(false);
      }
    };

    void loadPromotions();
  }, [open]);

  const filteredPromotions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return promotions;

    return promotions.filter((promotion) => {
      const name = promotion.promotionName?.toLowerCase() || "";
      const code = promotion.promoCode?.toLowerCase() || "";
      return name.includes(searchValue) || code.includes(searchValue);
    });
  }, [promotions, search]);

  const basePrice = selectedPlan?.finalPrice ?? 0;

  const selectedPromotion = useMemo(
    () => promotions.find((promotion) => promotion._id === selectedPromotionId),
    [promotions, selectedPromotionId],
  );

  const selectedDiscount = useMemo(() => {
    if (!selectedPromotion || basePrice <= 0) return 0;

    const rawValue = Number(selectedPromotion.discountValue ?? 0);
    if (!Number.isFinite(rawValue) || rawValue <= 0) return 0;

    if (selectedPromotion.discountType === "percentage") {
      return (basePrice * rawValue) / 100;
    }

    return Math.min(rawValue, basePrice);
  }, [basePrice, selectedPromotion]);

  const selectedPayable = Math.max(basePrice - selectedDiscount, 0);

  const handleApplyPromotion = async (
    promotion: PromotionItem,
  ): Promise<void> => {
    if (verifyingPromotionId || selectedPromotionId === promotion._id) return;

    try {
      setVerifyingPromotionId(promotion._id);
      const verifiedPromotion = await verifyPromotion(promotion.promoCode);
      setSelectedPromotionId(verifiedPromotion._id || promotion._id);
      toast.success("Promotion applied successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to verify promotion code.";
      toast.error(
        message === "Token missing" || message === "Token expired"
          ? "Please login first."
          : message,
      );
    } finally {
      setVerifyingPromotionId(null);
    }
  };

  const handleRemovePromotion = () => {
    setSelectedPromotionId(null);
  };

  const getPromotionDiscountLabel = (promotion: PromotionItem) => {
    const rawValue = Number(promotion.discountValue ?? 0);
    if (!Number.isFinite(rawValue) || rawValue <= 0) {
      return "No discount";
    }

    if (promotion.discountType === "percentage") {
      const amount = (basePrice * rawValue) / 100;
      return `${rawValue}% off (-$${amount.toFixed(2)})`;
    }

    const percent = basePrice > 0 ? (rawValue / basePrice) * 100 : 0;
    return `$${rawValue.toFixed(2)} off (${percent.toFixed(2)}%)`;
  };

  if (!selectedPlan) return null;

  const handleBuy = () => {
    const nextErrors = {
      travelStartDate: !travelStartDate
        ? "Travel start date is required."
        : travelStartDate < today
          ? "Past dates cannot be selected."
          : "",
      travelEndDate: !travelEndDate
        ? "Travel end date is required."
        : travelEndDate < today
          ? "Past dates cannot be selected."
          : "",
    };

    setTravelDateErrors(nextErrors);

    if (nextErrors.travelStartDate || nextErrors.travelEndDate) {
      toast.error("Please enter valid travel start and end dates.");
      return;
    }
    if (travelEndDate < travelStartDate) {
      toast.error("Travel end date must be on or after the start date.");
      return;
    }

    onBuy(selectedPromotionId || undefined, travelStartDate, travelEndDate);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!nextOpen ? onBack() : null)}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-lg overflow-hidden border-0 text-zinc-900 dark:text-zinc-50"
      >
        <div className="p-2 border-b border-gray-200 dark:border-zinc-700 flex justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <div>
            <DialogTitle className="text-lg font-[400]">
              Select Promotion
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedPlan.package_name}
            </p>
            <p className="text-lg font-bold text-black dark:text-white mt-1">
              <span>Price:</span> <span>${basePrice.toFixed(2)}</span>
              {selectedDiscount > 0 && (
                <>
                  <span className="mx-1">-</span>
                  <span>${selectedDiscount.toFixed(2)}</span>
                  <span className="mx-1">=</span>
                  <span className="font-medium">
                    ${selectedPayable.toFixed(2)}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-3xl -mt-2 font-[400px] cursor-pointer self-start"
          >
            &times;
          </button>
        </div>

        <div className="p-2 overflow-y-auto flex-1 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-300">
                Travel Start Date
              </label>
              <Input
                type="date"
                min={today}
                className={`bg-white dark:bg-zinc-900 ${
                  travelDateErrors.travelStartDate
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 dark:border-zinc-700"
                }`}
                value={travelStartDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setTravelStartDate(value);
                  setTravelDateErrors((prev) => ({
                    ...prev,
                    travelStartDate: !value
                      ? "Travel start date is required."
                      : value < today
                        ? "Past dates cannot be selected."
                        : "",
                    travelEndDate:
                      travelEndDate && travelEndDate < value
                        ? "Travel end date must be on or after the start date."
                        : prev.travelEndDate ===
                            "Travel end date must be on or after the start date."
                          ? ""
                          : prev.travelEndDate,
                  }));
                }}
              />
              {travelDateErrors.travelStartDate && (
                <p className="text-xs text-red-500">
                  {travelDateErrors.travelStartDate}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-300">
                Travel End Date
              </label>
              <Input
                type="date"
                min={travelStartDate || today}
                className={`bg-white dark:bg-zinc-900 ${
                  travelDateErrors.travelEndDate
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 dark:border-zinc-700"
                }`}
                value={travelEndDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setTravelEndDate(value);
                  setTravelDateErrors((prev) => ({
                    ...prev,
                    travelEndDate: !value
                      ? "Travel end date is required."
                      : value < today
                        ? "Past dates cannot be selected."
                        : travelStartDate && value < travelStartDate
                          ? "Travel end date must be on or after the start date."
                          : "",
                  }));
                }}
              />
              {travelDateErrors.travelEndDate && (
                <p className="text-xs text-red-500">
                  {travelDateErrors.travelEndDate}
                </p>
              )}
            </div>
          </div>

          <Input
            placeholder="Search by promotion name or code"
            className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loadingPromotions ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <FaSpinner className="animate-spin mr-2 inline" /> Loading
              promotions...
            </p>
          ) : filteredPromotions.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No promotions found.
            </p>
          ) : (
            filteredPromotions.map((promotion) => {
              const isSelected = selectedPromotionId === promotion._id;
              const isVerifying = verifyingPromotionId === promotion._id;

              return (
                <div
                  key={promotion._id}
                  className={`w-full flex justify-between text-left rounded-lg border px-3 py-2 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 dark:border-zinc-700 bg-[#F1F8FE] dark:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="pt-1">
                      {isSelected ? (
                        <FaCheckCircle className="text-[#00B625]" size={14} />
                      ) : (
                        <span className="inline-block w-[14px]" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {promotion.promotionName} - {promotion.promoCode}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {getPromotionDiscountLabel(promotion)}
                      </p>
                    </div>
                  </div>
                  {isSelected ? (
                    <button
                      type="button"
                      onClick={handleRemovePromotion}
                      className="text-xs text-red-500 hover:text-red-600 cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleApplyPromotion(promotion)}
                      disabled={!!verifyingPromotionId}
                      className="text-xs text-primary hover:text-primary/80 cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <span className="inline-flex items-center gap-1">
                          <FaSpinner className="animate-spin" size={10} />
                          Verifying
                        </span>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="p-2 rounded-b-2xl flex gap-2 sticky bottom-0 z-10">
          <Button
            onClick={onBack}
            className="bg-black dark:bg-zinc-700 flex-1 text-white hover:bg-gradient rounded-full px-4 py-2 text-sm"
          >
            Back
          </Button>
          <LoadingButton
            onClick={handleBuy}
            loading={orderLoading}
            label={orderLoading ? "Processing..." : "Buy"}
            className="bg-gradient cursor-pointer flex-1 text-white rounded-full px-4 py-2 text-sm"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
