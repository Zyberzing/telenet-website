"use client";

import { useCurrency } from "@/app/providers/CurrencyProvider";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EsimInformationItem, Pagination } from "@/lib/types";
import { getEsimDetails, getMyEsimList } from "@/services/esim";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Globe,
  Signal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type MyEsimProps = {
  initialList: EsimInformationItem[];
  initialPagination: Pagination | null;
  limit: number;
  initialPage: number;
};

const toDisplayValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export default function MyEsim({
  initialList,
  initialPagination,
  limit,
  initialPage,
}: MyEsimProps) {
  const t = useTranslations("MyEsim");
  const { formatAmount } = useCurrency();
  const [list, setList] = useState<EsimInformationItem[]>(initialList);
  const [pagination, setPagination] = useState<Pagination | null>(
    initialPagination,
  );
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedEsim, setSelectedEsim] = useState<EsimInformationItem | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const totalPages = pagination?.totalPages || 1;

  useEffect(() => {
    const loadList = async () => {
      try {
        setLoading(true);
        const res = await getMyEsimList(page, limit);
        setList(res?.result || []);
        setPagination(res?.pagination || null);
      } catch (error) {
        console.error("Failed to fetch my eSIM list:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadList();
  }, [page, limit]);

  const handleCardClick = async (item: EsimInformationItem) => {
    try {
      setDetailsLoading(true);
      const details = await getEsimDetails(item.orderId);

      if (!details) {
        toast.error(t("detailsLoadFailed"));
        return;
      }

      setSelectedEsim(details);
      setOpen(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900">
      {/* <div className="relative w-full h-[18vh]">
        <Image
          src="/banner-my-plans.svg"
          alt={t("bannerAlt")}
          fill
          className="object-cover object-top"
          priority
        />
      </div> */}

      <div className="max-w-4xl mx-auto py-10 px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl dark:text-white mb-8">
          {t("title")}
        </h1>

        {loading ? (
          <p className="text-sm text-gray-500">{t("loading")}</p>
        ) : list.length === 0 ? (
          <p className="text-[20px] dark:text-white">{t("noData")}</p>
        ) : (
          <>
            <div className="space-y-4">
              {list.map((item) => (
                <div
                  key={item._id}
                  onClick={() => void handleCardClick(item)}
                  className="bg-[#F1F8FE] dark:bg-gray-800 flex rounded-2xl p-4 shadow-sm cursor-pointer transition-all duration-300 hover:bg-[#FFF2E0] dark:hover:bg-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-lg dark:text-white">
                        {toDisplayValue(item.packageName)}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <p className="flex items-center gap-2">
                          <Signal size={14} /> {toDisplayValue(item.network)}
                        </p>
                        <p className="flex items-center gap-2">
                          <CreditCard size={14} />{" "}
                          {toDisplayValue(item.paymentStatus)}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <p className="flex items-center gap-2">
                          <Calendar size={14} />
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "-"}
                        </p>
                        <p className="flex items-center gap-2">
                          <Globe size={14} /> {toDisplayValue(item.coverage)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-3 min-w-[130px]">
                    <h3 className="text-lg dark:text-white">
                      {formatAmount(item.finalPrice || 0)}
                    </h3>
                    <span className="text-xs px-3 py-1 rounded-full border border-primary text-primary capitalize">
                      {toDisplayValue(item.orderStatus)}
                    </span>
                    <Button
                      size="sm"
                      className="rounded-full bg-primary hover:bg-primary text-white px-6"
                    >
                      {t("detailsTitle")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-start mt-8 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft /> {t("prev")}
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      size="sm"
                      variant={page === pageNumber ? "default" : "outline"}
                      onClick={() => setPage(pageNumber)}
                      disabled={loading}
                    >
                      {pageNumber}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                >
                  {t("next")} <ChevronRight />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-lg overflow-hidden border-0 text-zinc-900 dark:text-zinc-50"
        >
          <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
            <div>
              <DialogTitle className="text-lg font-[400]">
                {selectedEsim?.packageName || t("detailsTitle")}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("network")}: {toDisplayValue(selectedEsim?.network)}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-3xl -mt-2 font-[400px] cursor-pointer self-start"
            >
              &times;
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {detailsLoading ? (
              <p className="text-sm text-gray-500">{t("detailsLoading")}</p>
            ) : selectedEsim ? (
              <>
                <div>
                  <p className="text-[15px] mb-3 font-normal">
                    {t("detailsTitle")}
                  </p>
                  {/* <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-tl-xl">
                      {t("orderId")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-tr-xl break-all">
                      {toDisplayValue(selectedEsim.orderId)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("packageId")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 break-all">
                      {toDisplayValue(selectedEsim.packageId)}
                    </span>
                  </div> */}
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("coverage")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                      {toDisplayValue(selectedEsim.coverage)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("activationStatus")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                      {toDisplayValue(selectedEsim.activationStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("iccid")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 break-all">
                      {toDisplayValue(selectedEsim.iccid)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("imsi")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                      {toDisplayValue(selectedEsim.imsi)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-bl-xl">
                      {t("msisdn")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-br-xl">
                      {toDisplayValue(selectedEsim.msisdn)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[15px] mb-3 font-normal">
                    {t("paymentStatus")}
                  </p>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-tl-xl">
                      {t("orderStatus")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-tr-xl">
                      {toDisplayValue(selectedEsim.orderStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("paymentStatus")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                      {toDisplayValue(selectedEsim.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("paymentMethodType")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2">
                      {toDisplayValue(selectedEsim.paymentMethodType)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2">
                      {t("lpaString")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 break-all">
                      {toDisplayValue(selectedEsim.lpaString)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm gap-1 mb-1">
                    <span className="text-[#565656] bg-[#F1F8FE] dark:text-gray-300 dark:bg-zinc-800 w-full p-2 rounded-bl-xl">
                      {t("smdpAddress")}
                    </span>
                    <span className="text-start bg-[#F1F8FE] dark:bg-zinc-800 w-full p-2 rounded-br-xl break-all">
                      {toDisplayValue(selectedEsim.smdpAddress)}
                    </span>
                  </div>
                  <div className="flex justify-between font-[400] text-sm border border-primary dark:border-primary-dark rounded-xl px-3 text-center py-2 gap-1 mt-2">
                    <span className="w-full text-start px-2">{t("price")}</span>
                    <span className="text-start w-full px-2">
                      {formatAmount(selectedEsim.finalPrice || 0)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">{t("detailsLoadFailed")}</p>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-700">
            <Button
              onClick={() => setOpen(false)}
              className="w-full rounded-full bg-primary hover:bg-primary text-white"
            >
              {t("close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
