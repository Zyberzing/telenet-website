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
  DollarSign,
  LifeBuoy,
  RotateCw,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";

export default function OrderBilling() {
  const t = useTranslations("OrderBilling");

  const orders = [
    {
      id: "#10234",
      plan: "USA 5GB/30d",
      provider: "Verizon",
      payment: "Visa",
      status: "processing",
    },
    {
      id: "#10212",
      plan: "UK 10GB/15d",
      provider: "Vodafone",
      payment: "Wallet",
      status: "cancelled",
    },
    {
      id: "#10198",
      plan: "Japan 3GB/7d",
      provider: "NTT Docomo",
      payment: "Card",
      status: "inReview",
    },
    {
      id: "#10177",
      plan: "AUS 5GB/30d",
      provider: "Telstra",
      payment: "Visa",
      status: "refunded",
    },
    {
      id: "#10176",
      plan: "AUS 5GB/30d",
      provider: "Telstra",
      payment: "Visa",
      status: "active",
    },
    {
      id: "#10175",
      plan: "AUS 5GB/30d",
      provider: "Telstra",
      payment: "Visa",
      status: "expired",
    },
  ];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesProvider =
      !providerFilter || order.provider === providerFilter;
    return matchesStatus && matchesProvider;
  });

  const resetFilters = () => {
    setSelectedDate(undefined);
    setStatusFilter("");
    setProviderFilter("");
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Banner */}
      <div className="relative w-full h-[13vh] sm:h-[10vh] md:h-[20vh]">
        <Image
          src="/banner-orders-billing.svg"
          alt="Orders Bannerrr"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-sm font-medium">{t("filter")}</span>
            <Image src="/filter.svg" alt="Filter" height={14} width={15} />
          </div>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-md text-sm flex items-center gap-2"
              >
                <CalendarDays size={14} />
                {selectedDate
                  ? format(selectedDate, "dd MMM yyyy")
                  : t("dateRange")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-0"
              />
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[140px] text-sm rounded-md">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Processing">{t("processing")}</SelectItem>
              <SelectItem value="Cancelled">{t("cancelled")}</SelectItem>
              <SelectItem value="In Review">{t("inReview")}</SelectItem>
              <SelectItem value="Refunded">{t("refunded")}</SelectItem>
              <SelectItem value="Active">{t("active")}</SelectItem>
              <SelectItem value="Expired">{t("expired")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Provider Filter */}
          <Select onValueChange={setProviderFilter} value={providerFilter}>
            <SelectTrigger className="w-[140px] text-sm rounded-md">
              <SelectValue placeholder={t("provider")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Verizon">Verizon</SelectItem>
              <SelectItem value="Vodafone">Vodafone</SelectItem>
              <SelectItem value="NTT Docomo">NTT Docomo</SelectItem>
              <SelectItem value="Telstra">Telstra</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <XCircle size={14} />
            {t("resetFilters")}
          </button>
        </div>

        {/* Order List */}
        <Card className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm py-0">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient text-white">
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
              {filteredOrders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.plan}</td>
                  <td className="py-3 px-4">{order.provider}</td>
                  <td className="py-3 px-4">{order.payment}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium
                        ${
                          order.status === "processing"
                            ? "border border-[#00B625] p-1 text-[#00B625]"
                            : order.status === "cancelled"
                            ? "border border-[#FF6262] p-1 text-[#FF6262]"
                            : order.status === "inreview"
                            ? "border border-primary p-1 text-primary"
                            : order.status === "refunded"
                            ? "border border-[#B69B00] p-1 text-[#B69B00]"
                            : order.status === "active"
                            ? "border border-[#00B625] p-1 text-[#00B625]"
                            : "border border-[#929292] p-1 text-[#929292]"
                        }`}
                    >
                      {t(order.status.replace(/\s+/g, ""))}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <FaRegFilePdf color="#F25463" size={14} />
                      <span>{t("download")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="text-primary hover:text-primary">
                      <RotateCw size={16} />
                    </button>
                    <button className="text-[#EE3D4A] hover:text-primary">
                      <DollarSign size={16} />
                    </button>
                    <button className="text-primary hover:text-primary">
                      <LifeBuoy size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Pagination (static example) */}
        <div className="flex justify-start mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded border border-primary"
          >
            Prev
          </Button>
          <Button
            size="sm"
            className="rounded border border-primary bg-primary text-white"
          >
            01
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded border border-primary"
          >
            02
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded border border-primary"
          >
            03
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded border border-primary"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
