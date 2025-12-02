"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type Pack = {
  price: string;
  validity: string;
  data: string;
  bg: string;
  btn: string;
  planName: string;
  provider: string;
  network: string;
  type: string;
  taxCountry: string;
  total: string;
};

type PaymentDialogProps = {
  selectedPack: Pack | null;
  onClose: () => void;
  paymentMethod: "card" | "google" | "apple" | null;
  setPaymentMethod: Dispatch<
    SetStateAction<"card" | "google" | "apple" | null>
  >;
  setVirtualNumber: Dispatch<SetStateAction<string>>;
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  onConfirm: () => void;
  t: (key: string) => string;
};

export default function PaymentModal({
  selectedPack,
  onClose,
  paymentMethod,
  setPaymentMethod,
  setVirtualNumber,
  startDate,
  setStartDate,
  onConfirm,
  t,
}: PaymentDialogProps) {
  if (!selectedPack) return null;

  return (
    <Dialog open={selectedPack !== null} onOpenChange={() => onClose()}>
      <DialogContent
        className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-lg border-0"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10 dark:border-gray-700 dark:bg-gray-900">
          <div>
            <DialogTitle className="text-lg font-[400px] dark:text-white">
              {selectedPack?.planName}
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("provider")}: {selectedPack?.provider} | Network:{" "}
              {selectedPack?.network}
            </p>
          </div>
          <button
            onClick={() => onClose()}
            className="text-gray-500 hover:text-red-500 text-2xl font-light cursor-pointer dark:text-gray-400"
          >
            ×
          </button>
        </div>

        {/* Body – scrollable */}
        <div className="px-4 flex-1 space-y-5 overflow-y-auto">
          {/* Virtual Number + Start Date */}
          <div className="flex gap-2">
            <Select onValueChange={setVirtualNumber}>
              <SelectTrigger className="p-2">
                <SelectValue placeholder={t("selectNumber")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="44510275">44510275</SelectItem>
                <SelectItem value="99881234">99881234</SelectItem>
                <SelectItem value="77456321">77456321</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <Input
                type="date"
                className="h-[2.6em]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          {/* Plan Details */}
          <div className="space-y-3 text-sm p-3 border-1 border-gray-200 rounded-2xl">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("plan")}</span>
              <span className="font-medium">{selectedPack?.data}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("type")}</span>
              <span className="font-medium">{selectedPack?.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("duration")}</span>
              <span className="font-medium">{selectedPack?.validity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("taxCountry")}</span>
              <span className="font-medium underline">
                {selectedPack?.taxCountry}
              </span>
            </div>
            <hr className="border-[1px] border-dashed border-[#E6E6E6]" />
            <div className="flex justify-between font-[400px] text-base pt-2">
              <span>{t("total")}</span>
              <span>{selectedPack?.total}</span>
            </div>
          </div>

          {/* ─────── PAYMENT METHOD – collapsible sections ─────── */}
          <div className="space-y-3">
            <p className="text-md font-[600]">{t("selectPayment")}</p>

            {/* Credit / Debit Card */}
            <div className="overflow-hidden">
              <button
                onClick={() =>
                  setPaymentMethod(paymentMethod === "card" ? null : "card")
                }
                className={cn(
                  "flex items-center justify-between w-full p-3 text-left transition-all cursor-pointer rounded-lg",
                  paymentMethod === "card"
                    ? "bg-purple-50 dark:bg-purple-950 border-l-4 border-l-primary"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      paymentMethod === "card"
                        ? "border-primary bg-primary"
                        : "border-gray-400 dark:border-gray-600"
                    )}
                  >
                    {paymentMethod === "card" && (
                      <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{t("creditCard")}</span>
                </div>
                <ChevronRightIcon
                  className={cn(
                    "w-5 h-5 text-gray-400 dark:text-gray-500 transform transition-transform",
                    paymentMethod === "card" ? "rotate-90" : ""
                  )}
                />
              </button>

              {/* Expandable Card Form */}
              <div
                className={cn(
                  "transition-all overflow-hidden",
                  paymentMethod === "card" ? "max-h-96 p-3" : "max-h-0"
                )}
              >
                <div className="flex gap-2 mb-3">
                  <Image
                    src="/visa-card.svg"
                    alt="visa card"
                    height={20}
                    width={20}
                    className="object-cover object-top"
                  />
                  <Image
                    src="/master-visa-card.svg"
                    alt="visa card"
                    height={20}
                    width={20}
                    className="object-cover object-top"
                  />
                  <Image
                    src="/american-express-card.svg"
                    alt="visa card"
                    height={20}
                    width={20}
                    className="object-cover object-top"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[14px]">{t("cardNumber")}</label>
                  <Input
                    placeholder={t("cardNumber")}
                    className="rounded-lg mt-1"
                    defaultValue="1234 5678 9011 1121"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[14px]">{t("expiry")}</label>
                      <Input placeholder="MM/YY" className="rounded-lg mt-1" />
                    </div>
                    <div>
                      <label className="text-[14px]">{t("cvv")}</label>
                      <Input placeholder="123" className="rounded-lg mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="saveCard" className="rounded" />
                    <label
                      htmlFor="saveCard"
                      className="text-xs text-gray-600 dark:text-gray-400"
                    >
                      {t("saveCard")}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Pay */}
            <button
              onClick={() => setPaymentMethod("google")}
              className={cn(
                "flex items-center justify-between w-full p-3 transition-all cursor-pointer",
                paymentMethod === "google"
                  ? "border-primary bg-purple-50 dark:bg-purple-950 rounded-lg"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    paymentMethod === "google"
                      ? "border-primary bg-primary"
                      : "border-gray-400 dark:border-gray-600"
                  )}
                >
                  {paymentMethod === "google" && (
                    <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />
                  )}
                </div>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Image
                    src="/google-pay.svg"
                    alt="Top up banner"
                    height={20}
                    width={20}
                    className="object-cover object-top"
                  />{" "}
                  {t("googlePay")}
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>

            {/* Apple Pay */}
            <button
              onClick={() => setPaymentMethod("apple")}
              className={cn(
                "flex items-center justify-between w-full p-3 transition-all cursor-pointer",
                paymentMethod === "apple"
                  ? "border-primary bg-purple-50 dark:bg-purple-950 rounded-lg"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    paymentMethod === "apple"
                      ? "border-primary bg-primary"
                      : "border-gray-400 dark:border-gray-600"
                  )}
                >
                  {paymentMethod === "apple" && (
                    <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />
                  )}
                </div>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Image
                    src="/apple-pay.svg"
                    alt="Top up banner"
                    height={20}
                    width={20}
                    className="object-cover object-top"
                  />{" "}
                  {t("applePay")}
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-gray-50 dark:bg-gray-900 flex gap-2 sticky bottom-0">
          <Button
            variant="outline"
            className="flex-1 rounded-full bg-black hover:bg-black text-white hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => onClose()}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-primary text-white dark:bg-primary dark:text-black rounded-full"
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
