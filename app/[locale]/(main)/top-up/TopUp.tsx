"use client";

import PaymentModal from "@/components/modals/PaymentModal";
import SuccessModal from "@/components/modals/SuccessModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/routes";
import { CardSimIcon, ChevronRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const locale = useLocale();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "google" | "apple" | null
  >(null);
  const [virtualNumber, setVirtualNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");

  const handleConfirm = () => {
    const randomTxn = Math.floor(1000000000 + Math.random() * 9000000000);
    setTransactionId(randomTxn.toString());
    setShowSuccess(true);
    setSelectedPack(null);
  };
  console.log("virtual number", virtualNumber);

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black">
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
            <div className="bg-[#f4f9ff] dark:bg-gray-900 backdrop-blur-sm rounded-4xl p-0.5 md:p-2 flex items-center max-w-md w-full mx-4 gap-2 shadow-lg">
              <div className="flex bg-white dark:bg-gray-800 rounded-3xl gap-2 items-center flex-1 p-1">
                <div className="pl-3">
                  <CardSimIcon className="w-5 h-5 text-primary" />
                </div>
                <Input
                  type="text"
                  placeholder={t("enterNumber")}
                  className="rounded-3xl border-0 bg-transparent text-left font-medium text-lg focus:ring-0 flex-1 dark:text-gray-200"
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
          <p className="text-xl sm:text-2xl font-[400px] mb-6 text-center sm:text-left dark:text-gray-200">
            {t("availablePacks")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUpPacks.map((pack, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-[10px] font-medium bg-primary dark:bg-primary-foreground text-white px-2 py-1 rounded-md">
                    {t("providerLogo")}
                  </span>
                  <span className="text-[11px] font-extrabold text-red-700">
                    {t("trueSG")}
                  </span>
                </div>

                <div
                  className={`flex-1 p-5 rounded-b-2xl rounded-tr-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 ${pack.bg} dark:bg-gray-900 flex flex-col justify-between cursor-pointer`}
                  onClick={() => setSelectedPack(pack)}
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-[400px] text-gray-900 dark:text-white">
                      {pack.price}
                    </h2>
                    <ChevronRightIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="mt-4">
                    <div className="flex gap-5 text-gray-600 dark:text-gray-400 text-xs mb-1">
                      <span>{t("validity")}</span>
                      <span>{t("data")}</span>
                    </div>
                    <div className="flex gap-5 text-sm font-medium text-gray-800 dark:text-gray-200">
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
            <span
              className="ml-2 rounded-full p-1.5 bg-white text-purple-700 group-hover:scale-110 transition-transform"
              onClick={() => router.push(ROUTES.PLANS(locale))}
            >
              <IoIosArrowForward className="text-sm" />
            </span>
          </Button>
        </div>
      </div>
      {/* ──────────────────────── PAYMENT DIALOG ──────────────────────── */}
      <PaymentModal
        selectedPack={selectedPack}
        onClose={() => {
          setSelectedPack(null);
          setPaymentMethod(null);
        }}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        // virtualNumber={virtualNumber}
        setVirtualNumber={setVirtualNumber}
        startDate={startDate}
        setStartDate={setStartDate}
        onConfirm={handleConfirm}
        t={t}
      />
      {/* Success Dialog */}
      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        transactionId={transactionId}
      />
    </>
  );
}
