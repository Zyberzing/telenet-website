"use client";

import { Plan } from "@/app/[locale]/(main)/plans/Plans";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-button";
import { Heart } from "lucide-react";

interface PlanDetailsModalProps {
  selectedPlan: Plan | null;
  onClose: () => void;
  onBuy: () => void;
  orderLoading: boolean;
  adminMarkup: any | null;
}

export default function PlanDetailsModal({
  selectedPlan,
  onClose,
  onBuy,
  orderLoading,
  adminMarkup,
}: PlanDetailsModalProps) {
  if (!selectedPlan) return null;

  // console.log("cleanPlan", selectedPlan);

  const basePrice = selectedPlan.price || 0;
  const markup = adminMarkup?.markup || 0;
  const tax = adminMarkup?.tax || 0;
  // const total = basePrice + markup + tax;

  return (
    <Dialog open={!!selectedPlan} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden border-0"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between sticky top-0 bg-white z-10">
          <div>
            <DialogTitle className="text-lg font-[400]">
              {selectedPlan.package_name}
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Network: {selectedPlan.network || "-"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-3xl -mt-2 font-[400px] cursor-pointer self-start"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Plan Details */}
          <div>
            <p className="text-[15px] mb-3 font-normal">Plan Details</p>
            <div className="flex justify-between text-sm gap-1 mb-1">
              <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-tl-xl">
                Data
              </span>
              <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-tr-xl">
                {selectedPlan.data}
              </span>
            </div>
            <div className="flex justify-between text-sm gap-1 mb-1">
              <span className="text-[#565656] bg-[#F1F8FE] w-full p-2">
                Validity
              </span>
              <span className="text-start bg-[#F1F8FE] w-full p-2">
                {selectedPlan.validity} Days
              </span>
            </div>

            <div className="flex justify-between text-sm gap-1 mb-1">
              <span className="text-[#565656] bg-[#F1F8FE] w-full p-2">
                SMS
              </span>
              <span className="text-start bg-[#F1F8FE] w-full p-2">
                {selectedPlan.sms}
              </span>
            </div>
            <div className="flex justify-between text-sm gap-1 mb-1">
              <span className="text-[#565656] bg-[#F1F8FE] w-full p-2">
                Voice
              </span>
              <span className="text-start bg-[#F1F8FE] w-full p-2">
                {selectedPlan.call} Min
              </span>
            </div>
            <div className="flex justify-between text-sm gap-1">
              <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-bl-xl">
                Coverage
              </span>
              <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-br-xl">
                {selectedPlan.coverage}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <p className="text-[15px] mb-3 font-normal">Price Breakdown</p>
            <div className="flex justify-between text-sm gap-1 mb-1">
              <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-tl-xl">
                Base Price
              </span>
              <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-tr-xl">
                ${basePrice.toFixed(2)}
              </span>
            </div>

            {/* Markup Calculation */}

            {(() => {
              let markupAmount = 0;

              if (selectedPlan.markupType === "percentage") {
                markupAmount = (basePrice * selectedPlan.markupValue) / 100;
              } else {
                markupAmount = selectedPlan.markupValue;
              }

              const appliedMarkup =
                selectedPlan.actionType === "increase"
                  ? markupAmount
                  : -markupAmount;

              return (
                <div className="flex justify-between text-sm gap-1 mb-1">
                  <span className="text-[#565656] bg-[#F1F8FE] w-full p-2">
                    Markup
                  </span>

                  <span className="text-start bg-[#F1F8FE] w-full p-2">
                    ${appliedMarkup.toFixed(2)} ({selectedPlan.markupValue}
                    {selectedPlan.markupType === "percentage" ? "%" : ""},{" "}
                    {selectedPlan.actionType})
                  </span>
                </div>
              );
            })()}

            {/* Tax */}

            <div className="flex justify-between text-sm gap-1">
              <span className="text-[#565656] bg-[#F1F8FE] w-full p-2 rounded-bl-xl">
                Tax
              </span>

              <span className="text-start bg-[#F1F8FE] w-full p-2 rounded-br-xl">
                ${selectedPlan.tax?.toFixed(2) || "0.00"}
              </span>
            </div>

            {/* FINAL TOTAL */}

            {(() => {
              const base = basePrice;

              const markupAmount =
                selectedPlan.markupType === "percentage"
                  ? (base * selectedPlan.markupValue) / 100
                  : selectedPlan.markupValue;

              const applied =
                selectedPlan.actionType === "increase"
                  ? markupAmount
                  : -markupAmount;

              const taxAmount = selectedPlan.tax ?? 0;

              const finalTotal = base + applied + taxAmount;

              return (
                <div className="flex justify-between font-[400] text-sm border border-primary rounded-xl px-3 text-center py-2 gap-1 mt-2">
                  <span className="w-full text-start px-2">Final Price</span>

                  <span className="text-start w-full px-2">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* FUP / Notes */}
          {selectedPlan.fup_policy && (
            <div>
              <p className="text-[15px] font-medium">Expiry Rules:</p>
              <p className="mt-2 text-[#565656] text-[13px]">
                {selectedPlan.fup_policy}
              </p>
            </div>
          )}

          {/* Countries */}
          <div>
            <p className="text-[15px] font-medium mb-2">Available in:</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-700">
              {selectedPlan.countries.map((c) => (
                <span
                  key={c.countryiso2}
                  className="px-2 py-1 bg-gray-100 rounded-md"
                >
                  {c.countryname}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-gray-50 rounded-b-2xl flex justify-between items-center sticky bottom-0 z-10">
          <Heart className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
          <div className="flex gap-2 flex-1">
            <LoadingButton
              onClick={onBuy}
              loading={orderLoading}
              label={orderLoading ? "Processing..." : "Buy"}
              className="bg-gradient cursor-pointer flex-1 text-white rounded-full px-4 py-2 text-sm"
            />
            <Button className="bg-black flex-1 text-white hover:bg-gradient rounded-full px-4 py-2 text-sm">
              Add to Wallet
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
