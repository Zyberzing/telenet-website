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
import { getPromotionList } from "@/services/promotion";
import { useEffect, useMemo, useState } from "react";
import { FaSpinner } from "react-icons/fa";
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

  useEffect(() => {
    if (!open) {
      setSelectedPromotionId(null);
      setSearch("");
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
              Select Promotion
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedPlan.package_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-3xl -mt-2 font-[400px] cursor-pointer self-start"
          >
            x
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-2">
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

              return (
                <button
                  key={promotion._id}
                  type="button"
                  onClick={() =>
                    setSelectedPromotionId((prev) =>
                      prev === promotion._id ? null : promotion._id,
                    )
                  }
                  className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 dark:border-zinc-700 bg-[#F1F8FE] dark:bg-zinc-800"
                  }`}
                >
                  <p className="text-sm font-medium truncate">
                    {promotion.promotionName} - {promotion.promoCode}
                  </p>
                </button>
              );
            })
          )}
        </div>

        <DialogFooter className="p-4 rounded-b-2xl flex gap-2 sticky bottom-0 z-10">
          <Button
            onClick={onBack}
            className="bg-black dark:bg-zinc-700 flex-1 text-white hover:bg-gradient rounded-full px-4 py-2 text-sm"
          >
            Back
          </Button>
          <LoadingButton
            onClick={() => onBuy(selectedPromotionId || undefined)}
            loading={orderLoading}
            label={orderLoading ? "Processing..." : "Buy"}
            className="bg-gradient cursor-pointer flex-1 text-white rounded-full px-4 py-2 text-sm"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
