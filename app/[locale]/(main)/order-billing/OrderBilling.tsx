"use client";

import { useCurrency } from "@/app/providers/CurrencyProvider";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
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
import { Order, Pagination } from "@/lib/types";
import { getOrderList } from "@/services/order";
import { format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { FaRegFilePdf } from "react-icons/fa";

type ExtendedOrder = Order & {
  customerName?: string;
  name?: string;
  customerEmail?: string;
  email?: string;
  customerAddress?: string;
  address?: string;
  customerCountry?: string;
  country?: string;
  coverage?: string;
  data?: string | number;
  validity?: string | number;
  perioddays?: string | number;
  iccid?: string;
  validUntil?: string;
  paymentMethod?: string;
  amount?: string | number;
  totalAmount?: string | number;
  unit_price_gross_amount?: string | number;
};

export default function OrderBilling({
  initialOrders,
  initialPagination,
  limit,
}: {
  initialOrders: Order[];
  initialPagination: Pagination | null | undefined;
  limit: number;
}) {
  const t = useTranslations("OrderBilling");
  const { formatAmount } = useCurrency();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [search, setSearch] = useState("");
  // const itemsPerPage = 5;
  const totalPages = pagination?.totalPages || 1;
  const providerOptions = useMemo(() => {
    const values = new Set<string>();
    initialOrders.forEach((order) => {
      if (order.providerName) values.add(order.providerName);
    });
    return Array.from(values);
  }, [initialOrders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getOrderList(currentPage, limit, {
          startDate: selectedDateRange?.from
            ? format(selectedDateRange.from, "yyyy-MM-dd")
            : undefined,
          endDate: selectedDateRange?.to
            ? format(selectedDateRange.to, "yyyy-MM-dd")
            : selectedDateRange?.from
              ? format(selectedDateRange.from, "yyyy-MM-dd")
              : undefined,
          search,
          status: statusFilter,
          provider: providerFilter,
        });
        if (res) {
          setOrders(res.result || []);
          setPagination(res.pagination);
        }
      } catch (e) {
        console.error("Pagination fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    currentPage,
    limit,
    search,
    statusFilter,
    providerFilter,
    selectedDateRange,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, providerFilter, selectedDateRange]);

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
    setSelectedDateRange(undefined);
    setStatusFilter("");
    setProviderFilter("");
    setSearch("");
    setCurrentPage(1);
  };

  const escapePdfText = (value: unknown) =>
    String(value ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");

  const buildPdfBlob = (drawCommands: string[]) => {
    const content = drawCommands.join("\n");

    const objects: string[] = [];
    objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
    objects[3] =
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>";
    objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
    objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
    objects[6] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;

    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [];

    for (let i = 1; i <= 6; i++) {
      offsets[i] = pdf.length;
      pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const xrefPos = pdf.length;
    pdf += `xref\n0 7\n0000000000 65535 f \n`;

    for (let i = 1; i <= 6; i++)
      pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;

    pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

    return new Blob([new TextEncoder().encode(pdf)], {
      type: "application/pdf",
    });
  };

  const handleInvoiceDownload = (rawOrder: Order) => {
    const order = rawOrder as ExtendedOrder;

    const invoiceDate = order.createdAt
      ? format(new Date(order.createdAt), "dd/MM/yyyy")
      : format(new Date(), "dd/MM/yyyy");

    const amount =
      order.totalAmount ?? order.amount ?? order.unit_price_gross_amount ?? "-";
    const formattedAmount = amount === "-" ? "-" : formatAmount(amount);

    let y = 800;
    const left = 60;
    const right = 535;

    const line = (yy: number) => `0.7 w ${left} ${yy} m ${right} ${yy} l S`;

    const text = (
      x: number,
      y: number,
      size: number,
      value: string,
      bold = false,
    ) =>
      `BT /F${bold ? 2 : 1} ${size} Tf ${x} ${y} Td (${escapePdfText(value)}) Tj ET`;

    const draw: string[] = [];

    /* HEADER */
    draw.push(text(left, y, 18, t("invoiceCompanyName"), true));
    draw.push(text(420, y, 18, t("invoiceTitle"), true));

    y -= 20;
    draw.push(text(left, y, 9, t("invoiceCompanyAddress")));
    y -= 12;
    draw.push(
      text(
        left,
        y,
        9,
        t("invoiceCompanyContact"),
      ),
    );
    y -= 12;
    draw.push(text(left, y, 9, t("invoiceCompanyTaxId")));

    draw.push(text(360, y + 24, 9, `${t("invoiceNumber")}: ${order._id}`));
    draw.push(text(360, y + 10, 9, `${t("orderNumber")}: ${order._id}`));
    draw.push(text(360, y - 4, 9, `${t("invoiceDate")}: ${invoiceDate}`));

    y -= 25;
    draw.push(line(y));

    /* BILL TO */
    y -= 30;
    draw.push(text(left, y, 12, t("billTo"), true));

    y -= 18;
    draw.push(
      text(
        left,
        y,
        10,
        order.customerName || order.name || t("customerFallback"),
        true,
      ),
    );
    y -= 14;
    draw.push(text(left, y, 10, order.customerEmail || "-"));
    y -= 14;
    draw.push(text(left, y, 10, order.customerAddress || "-"));
    y -= 14;
    draw.push(
      text(
        left,
        y,
        10,
        `${t("countryLabel")}: ${order.customerCountry || order.country || "-"}`,
      ),
    );

    /* ORDER DETAILS */
    y -= 30;
    draw.push(text(left, y, 12, t("orderDetails"), true));

    y -= 18;

    const rows = [
      [t("packageName"), order.package_name],
      [t("providerLabel"), order.providerName || "-"],
      [t("coverage"), order.coverage],
      [t("dataLabel"), order.data ?? order.package_data],
      [t("duration"), order.validity ?? order.perioddays],
      [t("iccid"), order.iccid],
      [t("validUntil"), order.validUntil],
      [t("paymentMethod"), order?.paymentMethodType || t("card")],
      [t("orderStatus"), order.status?.toUpperCase()],
    ];

    rows.forEach(([label, value]) => {
      draw.push(text(left, y, 10, String(label || "-")));
      draw.push(text(left + 170, y, 10, String(value ?? "-")));
      y -= 18;
    });

    /* PAYMENT SUMMARY */
    y -= 20;
    draw.push(text(left, y, 12, t("paymentSummary"), true));

    y -= 20;
    draw.push(text(left, y, 10, t("totalAmount")));
    draw.push(text(left + 170, y, 10, formattedAmount));

    y -= 18;
    draw.push(text(left, y, 10, t("paymentStatus")));
    draw.push(text(left + 170, y, 10, (order.status || "-").toUpperCase()));

    /* FOOTER */
    draw.push(line(100));
    draw.push(text(220, 80, 9, t("invoiceThanks"), true));
    draw.push(
      text(180, 65, 8, t("invoiceSupportNote")),
    );

    const blob = buildPdfBlob(draw);

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order._id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
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
          alt={t("ordersBannerAlt")}
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
            <Image src="/filter.svg" alt={t("filterAlt")} height={14} width={15} />
          </div>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-md text-sm flex items-center gap-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              >
                <CalendarDays size={14} />
                {selectedDateRange?.from
                  ? selectedDateRange.to
                    ? `${format(selectedDateRange.from, "dd MMM yyyy")} - ${format(
                        selectedDateRange.to,
                        "dd MMM yyyy",
                      )}`
                    : format(selectedDateRange.from, "dd MMM yyyy")
                  : t("dateRange")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-800 dark:border-gray-700">
              <Calendar
                mode="range"
                selected={selectedDateRange}
                onSelect={setSelectedDateRange}
                className="p-0 dark:text-gray-200"
              />
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[140px] text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 cursor-pointer">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 cursor-pointer">
              <SelectItem className="cursor-pointer" value="failed">
                {t("failed")}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="cancelled">
                {t("cancelled")}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="completed">
                {t("completed")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Provider Filter */}
          <Select onValueChange={setProviderFilter} value={providerFilter}>
            <SelectTrigger className="w-[140px] text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 cursor-pointer">
              <SelectValue placeholder={t("provider")} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 cursor-pointer">
              {providerOptions.length > 0 ? (
                providerOptions.map((provider) => (
                  <SelectItem
                    key={provider}
                    className="cursor-pointer"
                    value={provider}
                  >
                    {provider}
                  </SelectItem>
                ))
              ) : (
                <SelectItem className="cursor-pointer" value="Zetexa">
                  Zetexa
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-[240px] rounded-md text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
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
                <th className="py-3 px-4 text-left font-medium whitespace-nowrap">
                  {t("paymentOption")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("status")}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t("invoice")}
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
                    <td className="py-3 px-4 whitespace-nowrap">
                      {order?.package_name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {order?.providerName || "-"}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {order?.paymentMethodType || t("card")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium capitalize
                        ${
                          order.status.toLowerCase() === "completed"
                            ? "border border-[#00B625] text-[#00B625]"
                            : order.status.toLowerCase() === "failed"
                              ? "border border-[#FF6262] text-[#FF6262]"
                              : order.status.toLowerCase() === "cancelled"
                                ? "border border-[#FFA500] text-[#FFA500]"
                                : "border border-[#929292] text-[#929292] dark:border-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {order?.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleInvoiceDownload(order)}
                        className="flex items-center gap-1 cursor-pointer hover:text-primary"
                      >
                        <FaRegFilePdf color="#F25463" size={14} />
                        <span>{t("download")}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 px-4 text-center dark:text-gray-300"
                  >
                    {t("noOrders")}
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
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft /> {t("prev")}
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              disabled={loading}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="rounded border border-primary dark:border-blue-400 dark:text-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            {t("next")} <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
