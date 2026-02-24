"use client";

import CompatibilityCheckModal from "@/components/modals/CompatibilityCheckModal";
import PromotionSelectionModal from "@/components/modals/PromotionSelectionModal";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plan } from "@/lib/types";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PlanDetailsModalProps {
  selectedPlan: Plan | null;
  onClose: () => void;
  onBuy: (promotionId?: string) => void;
  orderLoading: boolean;
  isLoggedIn: boolean;
}

export default function PlanDetailsModal({
  selectedPlan,
  onClose,
  onBuy,
  orderLoading,
  isLoggedIn,
}: PlanDetailsModalProps) {
  const [openCompatibilityModal, setOpenCompatibilityModal] = useState(false);
  const [openPromotionModal, setOpenPromotionModal] = useState(false);

  useEffect(() => {
    if (!selectedPlan) {
      setOpenCompatibilityModal(false);
      setOpenPromotionModal(false);
    }
  }, [selectedPlan]);

  if (!selectedPlan) return null;

  const handleCloseAll = () => {
    setOpenCompatibilityModal(false);
    setOpenPromotionModal(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={!!selectedPlan && !openCompatibilityModal && !openPromotionModal}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) handleCloseAll();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-lg overflow-hidden border-0 text-zinc-900 dark:text-zinc-50"
        >
          <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
            <div>
              <DialogTitle className="text-lg font-[400]">
                {selectedPlan.package_name}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Network: {selectedPlan.network || "-"}
              </p>
            </div>
            <button
              onClick={handleCloseAll}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-3xl -mt-2 font-[400px] cursor-pointer self-start"
            >
              x
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            <div>
              <p className="text-[15px] mb-3 font-normal">Plan Details</p>
              <div className="flex justify-between text-sm gap-1 mb-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-tl-xl">
                  Data
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-tr-xl">
                  {selectedPlan.data}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-1 mb-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                  Validity
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                  {selectedPlan.validity} Days
                </span>
              </div>
              <div className="flex justify-between text-sm gap-1 mb-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                  SMS
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                  {selectedPlan.sms}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-1 mb-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                  Voice
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                  {selectedPlan.call} Min
                </span>
              </div>
              <div className="flex justify-between text-sm gap-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-bl-xl">
                  Coverage
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-br-xl">
                  {selectedPlan.coverage}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[15px] mb-3 font-normal">Price Breakdown</p>
              <div className="flex justify-between text-sm gap-1 mb-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-tl-xl">
                  Price
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-tr-xl">
                  ${" "}
                  {(
                    (selectedPlan.basePrice ?? 0) +
                    (selectedPlan.markupAmount ?? 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-1 mb-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                  Tax
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                  ${selectedPlan.taxAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-1">
                <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-bl-xl">
                  Stripe
                </span>
                <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-br-xl">
                  ${selectedPlan.stripe?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between font-[400] text-sm border border-primary dark:border-primary-dark rounded-xl px-3 text-center py-2 gap-1 mt-2">
                <span className="w-full text-start px-2">Final Price</span>
                <span className="text-start w-full px-2">
                  ${selectedPlan.finalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {selectedPlan.fup_policy && (
              <div>
                <p className="text-[15px] font-medium">Expiry Rules:</p>
                <p className="mt-2 text-[#565656] dark:text-gray-300 text-[13px]">
                  {selectedPlan.fup_policy}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 rounded-b-2xl flex justify-between items-center sticky bottom-0 z-10">
            <Heart className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-red-500" />
            <div className="flex gap-2 flex-1">
              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.error("Please login first.");
                    return;
                  }
                  setOpenCompatibilityModal(true);
                }}
                className="bg-gradient flex-1 text-white rounded-full px-4 py-2 text-sm"
              >
                Compatibility Check
              </Button>
              <Button className="bg-black dark:bg-zinc-700 flex-1 text-white hover:bg-gradient rounded-full px-4 py-2 text-sm">
                Add to Wallet
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CompatibilityCheckModal
        open={!!selectedPlan && openCompatibilityModal}
        selectedPlan={selectedPlan}
        onBack={() => setOpenCompatibilityModal(false)}
        onClose={handleCloseAll}
        onNext={() => {
          setOpenCompatibilityModal(false);
          setOpenPromotionModal(true);
        }}
      />

      <PromotionSelectionModal
        open={!!selectedPlan && openPromotionModal}
        selectedPlan={selectedPlan}
        onBack={() => {
          setOpenPromotionModal(false);
          setOpenCompatibilityModal(true);
        }}
        onClose={handleCloseAll}
        onBuy={onBuy}
        orderLoading={orderLoading}
      />
    </>
  );
}
