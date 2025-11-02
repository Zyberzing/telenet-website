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
import { CardSimIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

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

const topUpPacks: Pack[] = [
  {
    price: "$5",
    validity: "7 Days",
    data: "1 GB",
    bg: "bg-[#fff2e1]",
    btn: "bg-[#E49B2C] hover:bg-[#E49B2C]",
    planName: "USA 1GB, 7 Days",
    provider: "Verizon",
    network: "4G/5G",
    type: "Data Only",
    taxCountry: "India",
    total: "$5.99",
  },
  {
    price: "$10",
    validity: "15 Days",
    data: "3 GB",
    bg: "bg-[#f1f8fe]",
    btn: "bg-gradient hover:from-primary hover:to-pink-600",
    planName: "USA 3GB, 15 Days",
    provider: "AT&T",
    network: "5G",
    type: "Data Only",
    taxCountry: "India",
    total: "$11.99",
  },
  {
    price: "$18",
    validity: "30 Days",
    data: "8 GB",
    bg: "bg-[#f1f8fe]",
    btn: "bg-gradient hover:from-primary hover:to-pink-600",
    planName: "USA 8GB, 30 Days",
    provider: "T-Mobile",
    network: "5G",
    type: "Data Only",
    taxCountry: "India",
    total: "$19.99",
  },
  {
    price: "$30",
    validity: "60 Days",
    data: "10 GB",
    bg: "bg-[#f1f8fe]",
    btn: "bg-gradient hover:from-primary hover:to-pink-600",
    planName: "USA 10GB, 60 Days",
    provider: "Verizon",
    network: "5G",
    type: "Data Only",
    taxCountry: "India",
    total: "$31.99",
  },
];

export default function TopUp() {
  const t = useTranslations("TopUp");
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "google" | "apple" | null
  >(null);
  const [virtualNumber, setVirtualNumber] = useState<string>(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [startDate, setStartDate] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");

  const handleConfirm = () => {
    const randomTxn = Math.floor(1000000000 + Math.random() * 9000000000);
    setTransactionId(randomTxn.toString());
    setShowSuccess(true);
    setSelectedPack(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative w-full h-[20vh] sm:h-[25vh] md:h-[37vh]">
        <Image
          src="/banner-top-up.svg"
          alt="Top up banner"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 flex items-end justify-center pb-1 md:pb-6">
          <div className="bg-[#f4f9ff] backdrop-blur-sm rounded-4xl p-0.5 md:p-2 flex items-center max-w-md w-full mx-4 gap-2 shadow-lg">
            <div className="flex bg-white rounded-3xl gap-2 items-center flex-1 p-1">
              <div className="pl-3">
                <CardSimIcon className="w-5 h-5 text-primary" />
              </div>
              <Input
                type="text"
                placeholder={t("enterNumber")}
                className="rounded-3xl border-0 bg-transparent text-left font-medium text-lg focus:ring-0 flex-1"
              />
            </div>
            <Button className="rounded-3xl bg-primary hover:bg-purple-700 text-white p-3">
              <FaMagnifyingGlass className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Packs */}
      <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <p className="text-xl sm:text-2xl font-[400px] mb-6 text-center sm:text-left">
          {t("availablePacks")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topUpPacks.map((pack, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-medium bg-primary text-white px-2 py-1 rounded-md">
                  {t("providerLogo")}
                </span>
                <span className="text-[11px] font-extrabold text-red-700">
                  {t("trueSG")}
                </span>
              </div>

              <div
                className={`flex-1 p-5 rounded-b-2xl rounded-tr-2xl rounded-tl-sm shadow-sm border border-gray-100 ${pack.bg} flex flex-col justify-between cursor-pointer`}
                onClick={() => setSelectedPack(pack)}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl font-[400px] text-gray-900">
                    {pack.price}
                  </h2>
                  <ChevronRightIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="mt-4">
                  <div className="flex gap-5 text-gray-600 text-xs mb-1">
                    <span>{t("validity")}</span>
                    <span>{t("data")}</span>
                  </div>
                  <div className="flex gap-5 text-sm font-medium text-gray-800">
                    <span>{pack.validity}</span>
                    <span>{pack.data}</span>
                  </div>
                </div>
                <Button
                  className={`w-full mt-5 rounded-3xl text-white font-medium ${pack.btn} transition-all`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPack(pack);
                  }}
                >
                  {t("selectPack")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharge Button */}
      <div className="flex justify-center mt-12 mb-16 px-4">
        <Button className="group flex items-center gap-2 px-8 py-6 bg-gradient text-white font-medium rounded-3xl shadow-lg transition-all text-sm sm:text-base">
          {t("rechargeNow")}
          <span className="ml-2 rounded-full p-1.5 bg-white text-purple-700 group-hover:scale-110 transition-transform">
            <IoIosArrowForward className="text-sm" />
          </span>
        </Button>
      </div>

      {/* ──────────────────────── PAYMENT DIALOG ──────────────────────── */}
      <Dialog
        open={selectedPack !== null}
        onOpenChange={() => setSelectedPack(null)}
      >
        <DialogContent
          className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-lg border-0"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-[400px]">{selectedPack?.planName}</h2>
              <p className="text-sm text-gray-500">
                {t("provider")}: {selectedPack?.provider} | Network:{" "}
                {selectedPack?.network}
              </p>
            </div>
            <button
              onClick={() => setSelectedPack(null)}
              className="text-gray-500 hover:text-red-500 text-2xl font-light cursor-pointer"
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
                    "flex items-center justify-between w-full p-3 text-left transition-all cursor-pointer",
                    paymentMethod === "card"
                      ? "bg-purple-50 border-l-4 border-l-primary"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        paymentMethod === "card"
                          ? "border-primary bg-primary"
                          : "border-gray-400"
                      )}
                    >
                      {paymentMethod === "card" && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {t("creditCard")}
                    </span>
                  </div>
                  <ChevronRightIcon
                    className={cn(
                      "w-5 h-5 text-gray-400 transform transition-transform",
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
                        <Input
                          placeholder="MM/YY"
                          className="rounded-lg mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[14px]">{t("cvv")}</label>
                        <Input placeholder="123" className="rounded-lg mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        className="rounded"
                      />
                      <label
                        htmlFor="saveCard"
                        className="text-xs text-gray-600"
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
                    ? "border-primary bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      paymentMethod === "google"
                        ? "border-primary bg-primary"
                        : "border-gray-400"
                    )}
                  >
                    {paymentMethod === "google" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
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
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </button>

              {/* Apple Pay */}
              <button
                onClick={() => setPaymentMethod("apple")}
                className={cn(
                  "flex items-center justify-between w-full p-3 transition-all cursor-pointer",
                  paymentMethod === "apple"
                    ? "border-primary bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      paymentMethod === "apple"
                        ? "border-primary bg-primary"
                        : "border-gray-400"
                    )}
                  >
                    {paymentMethod === "apple" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
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
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 bg-gray-50 flex gap-2 sticky bottom-0">
            <Button
              variant="outline"
              className="flex-1 rounded-full bg-black hover:bg-black text-white hover:text-white"
              onClick={() => setSelectedPack(null)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-primary hover:bg-purple-700 text-white rounded-full"
            >
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center p-8 rounded-3xl shadow-xl h-100 w-96 items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-[#21BE7933] mb-5">
              <div className="w-16 h-16 rounded-full bg-[#21BE79] flex items-center justify-center">
                <span className="text-white text-4xl">&#10003;</span>
              </div>
            </div>
            <h2 className="text-[28px] font-[400px] text-gray-800">
              Payment Successful
            </h2>
            <p className="text-sm text-[#000000A6]">
              Transaction Number: {transactionId}
            </p>
            <Button
              className="mt-4 bg-primary hover:primary text-white rounded-full px-6 py-3"
              onClick={() => setShowSuccess(false)}
            >
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
