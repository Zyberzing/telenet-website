"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaFileExport, FaRegFilePdf } from "react-icons/fa";

export default function Wallet() {
  const t = useTranslations("Wallet");

  // sample transaction data
  const transactions = [
    {
      date: "12 Sep 25",
      amount: 20,
      method: "Google Pay",
      status: "Completed",
    },
    {
      date: "05 Sep 25",
      amount: 15,
      method: "Credit Card",
      status: "Completed",
    },
    {
      date: "22 Aug 25",
      amount: 10,
      method: "Wallet Auto",
      status: "Pending",
    },
    {
      date: "15 Aug 25",
      amount: 30,
      method: "Apple Pay",
      status: "Completed",
    },
  ];

  const [filterDate, setFilterDate] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // filtering logic
  const filteredTransactions = transactions.filter((tx) => {
    const dateMatch = filterDate === "All" || tx.date.includes(filterDate);
    const methodMatch = filterMethod === "All" || tx.method === filterMethod;
    const statusMatch = filterStatus === "All" || tx.status === filterStatus;
    return dateMatch && methodMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Banner */}
      <div className="relative w-full h-[13vh] sm:h-[10vh] md:h-[20vh]">
        <Image
          src="/banner-wallet.svg"
          alt="Wallet Banner"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Wallet Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Controls */}
        <div className="mb-6 gap-4 w-full ">
          <div className="flex place-self-end items-center justify-between sm:justify-start gap-3">
            <p className="text-gray-700 font-medium">{t("autoTopUp")}</p>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Wallet Balance Card */}
        <Card className="p-6 shadow-md border border-[#CDE9FE] mb-8 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 text-sm">{t("walletBalance")}</p>
              <p className="text-3xl sm:text-4xl font-[400px] text-primary mt-2">
                $50
              </p>
            </div>
            <Button className="rounded-full px-10 mx-6">{t("addMoney")}</Button>
          </div>
        </Card>

        {/* Transaction History */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-[400px] text-gray-900">
              {t("transactionHistory")}
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap items-center place-content-start sm:place-content-end gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm">{t("filter")}</span>
                <Image src="/filter.svg" alt="Filter" height={14} width={15} />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Select onValueChange={setFilterDate}>
                  <SelectTrigger className="text-sm text-gray-500">
                    <SelectValue placeholder={t("date")} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <input
                        type="date"
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700"
                      />
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Method Filter */}
              <Select onValueChange={setFilterMethod}>
                <SelectTrigger className="text-sm text-gray-500">
                  <SelectValue placeholder={t("method")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google Pay">Google Pay</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                  <SelectItem value="Wallet Auto">Wallet Auto</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select onValueChange={setFilterStatus}>
                <SelectTrigger className="text-sm text-gray-500">
                  <SelectValue placeholder={t("status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">{t("completed")}</SelectItem>
                  <SelectItem value="Pending">{t("pending")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button
                variant="outline"
                className="rounded-md text-sm flex items-center gap-3"
              >
                <FaFileExport size={14} />
                {t("export")}
              </Button>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-[400px]">
                    {t("date")}
                  </th>
                  <th className="py-3 px-4 text-left font-[400px]">
                    {t("amount")}
                  </th>
                  <th className="py-3 px-4 text-left font-[400px]">
                    {t("method")}
                  </th>
                  <th className="py-3 px-4 text-left font-[400px]">
                    {t("status")}
                  </th>
                  <th className="py-3 px-4 text-left font-[400px]">
                    {t("invoice")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{tx.date}</td>
                    <td className="py-3 px-4">${tx.amount}</td>
                    <td className="py-3 px-4">{tx.method}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium w-full ${
                          tx.status === "Completed"
                            ? "border border-[#00B625] text-[#00B625]"
                            : "border border-primary text-primary"
                        }`}
                      >
                        {t(tx.status.toLowerCase())}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-1">
                      <FaRegFilePdf color="#F25463" size={14} />
                      <span className="text-black">{t("download")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
