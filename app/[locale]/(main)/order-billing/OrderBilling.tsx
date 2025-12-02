"use client";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/Card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  LifeBuoy,
  RotateCw,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";

export interface Order {
  _id: string;
  plan: {
    package_name: string;
    package_data: string;
  };
  provider: string;
  payment: string;
  status: string;
}

export default function OrderBilling({ orders }: { orders: Order[] }) {
  const t = useTranslations("OrderBilling");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  // const filteredOrders = useMemo(() => {
  //   return orders.filter((order) => {
  //     const matchesStatus = !statusFilter || order.status === statusFilter;
  //     const matchesProvider =
  //       !providerFilter || order.provider === providerFilter;
  //     return matchesStatus && matchesProvider;
  //   });
  // }, [orders, statusFilter, providerFilter]);

  // const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  // const currentOrders = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  // }, [filteredOrders, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSelectedDate(undefined);
    setStatusFilter("");
    setProviderFilter("");
    setCurrentPage(1);
  };

  // const handlePageChange = (page: number) => {
  //   if (page >= 1 && page <= totalPages) setCurrentPage(page);
  // };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
      {/* Banner */}
      <div className="relative w-full h-[13vh] sm:h-[10vh] md:h-[20vh]">
        <Image
          src="/banner-orders-billing.svg"
          alt="Orders Banner"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-sm font-medium">{t("filter")}</span>
            <Image src="/filter.svg" alt="Filter" height={14} width={15} />
          </div>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-md text-sm flex items-center gap-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              >
                <CalendarDays size={14} />
                {selectedDate
                  ? format(selectedDate, "dd MMM yyyy")
                  : t("dateRange")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-800 dark:border-gray-700">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-0 dark:text-gray-200"
              />
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[140px] text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              <SelectItem value="processing">{t("processing")}</SelectItem>
              <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
              <SelectItem value="inReview">{t("inReview")}</SelectItem>
              <SelectItem value="refunded">{t("refunded")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="expired">{t("expired")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Provider Filter */}
          <Select onValueChange={setProviderFilter} value={providerFilter}>
            <SelectTrigger className="w-[140px] text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              <SelectValue placeholder={t("provider")} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
              <SelectItem value="Verizon">Verizon</SelectItem>
              <SelectItem value="Vodafone">Vodafone</SelectItem>
              <SelectItem value="NTT Docomo">NTT Docomo</SelectItem>
              <SelectItem value="Telstra">Telstra</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            <XCircle size={14} />
            {t("resetFilters")}
          </button>
        </div>

        {/* Orders Table */}
        <Card className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm py-0 dark:bg-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient text-white dark:bg-gray-700 dark:text-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-medium">
                  {t("orderId")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("planName")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("provider")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("paymentOption")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("status")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("invoice")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders?.map((order) => (
                  <tr
                    key={order?._id}
                    className="border-b last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4">{order?._id}</td>
                    <td className="py-3 px-4">{order.plan?.package_name}</td>
                    <td className="py-3 px-4">{order?.provider || "-"}</td>
                    <td className="py-3 px-4">{order?.payment || "-"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium
                        ${order.status === "processing"
                            ? "border border-[#00B625] text-[#00B625]"
                            : order.status === "cancelled"
                              ? "border border-[#FF6262] text-[#FF6262]"
                              : order.status === "inReview"
                                ? "border border-primary text-primary dark:border-blue-400 dark:text-blue-400"
                                : order.status === "refunded"
                                  ? "border border-[#B69B00] text-[#B69B00]"
                                  : order.status === "Completed"
                                    ? "border border-[#00B625] text-[#00B625]"
                                    : "border border-[#929292] text-[#929292] dark:border-gray-500 dark:text-gray-400"
                          }`}
                      >
                        {order?.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FaRegFilePdf color="#F25463" size={14} />
                        <span>{t("download")}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-primary hover:text-primary dark:text-blue-400 dark:hover:text-blue-300">
                          <RotateCw size={16} />
                        </button>
                        <button className="text-[#EE3D4A] hover:text-primary dark:text-red-400 dark:hover:text-red-300">
                          <DollarSign size={16} />
                        </button>
                        <button className="text-primary hover:text-primary dark:text-blue-400 dark:hover:text-blue-300">
                          <LifeBuoy size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))
                : (
                  <tr>
                    <td colSpan={7} className="py-3 px-4 text-center dark:text-gray-300">
                      No Order Available
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </Card>

        {/* Pagination */}
        <div className="flex justify-start mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded border border-primary dark:border-blue-400 dark:text-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            // onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft /> Prev
          </Button>

          {/* {Array.from({ length: totalPages }, (_, i) => ( */}
          <Button
            // key={i}
            size="sm"
            // variant={currentPage === i + 1 ? "default" : "outline"}
            className={`rounded border border-primary dark:border-blue-400 dark:text-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
          // onClick={() => handlePageChange(i + 1)}
          >
            1{/* {String(i + 1).padStart(2, "0")} */}
          </Button>
          {/* ))} */}

          <Button
            variant="outline"
            size="sm"
            className="rounded border border-primary dark:border-blue-400 dark:text-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          // onClick={() => handlePageChange(currentPage + 1)}
          // disabled={currentPage === totalPages}
          >
            Next <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
