"use client";

import { TicketDetailModal } from "@/components/modals";
import CreateTicketModal from "@/components/modals/CreateTicketModal";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
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
import { Ticket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getTickets } from "@/services/ticket";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";

interface SupportProps {
  initialTickets: Ticket[];
}

export default function Support({ initialTickets }: SupportProps) {
  const t = useTranslations("Support");
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"open" | "pending" | "closed">("pending");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [date, setDate] = useState<Date>(new Date());
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getTickets({
        page: 1,
        limit: 20,
        status: tab,
        priority,
        search,
        date: format(date, "yyyy-MM-dd"),
      });

      setTickets(data);
    } catch (e: unknown) {
      console.error("Failed fetching tickets:", e);
    } finally {
      setLoading(false);
    }
  }, [tab, priority, search, date]);

  useEffect(() => {
    const delay = setTimeout(fetchTickets, 400);
    return () => clearTimeout(delay);
  }, [fetchTickets]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="relative">
        <Image
          src="/banner-support.svg"
          alt={t("title")}
          width={1500}
          height={1000}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex justify-between mb-8">
          <div className="flex gap-2">
            {["open", "pending", "closed"].map((status) => (
              <Button
                key={status}
                variant={tab === status ? "default" : "outline"}
                onClick={() => setTab(status as "open" | "pending" | "closed")}
                className={cn(
                  "capitalize",
                  tab === status
                    ? "bg-primary text-white hover:bg-primary border border-primary"
                    : "border-primary border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {t(status.toLowerCase())}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setIsNewTicketOpen(true)}
            className="bg-primary text-white text-sm"
          >
            <IoIosAddCircleOutline />
            {t("raiseTicket")}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <p className="text-lg">{t("ticketList")}</p>

            <Input
              placeholder={t("search")}
              className="max-w-52 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm">{t("filter")}</span>
              <Image src="/filter.svg" alt="Filter" height={14} width={15} />
            </div>

            {/* Date Calendar */}
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {format(date, "dd MMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 bg-white dark:bg-gray-800 w-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d ?? new Date());
                    setIsDateOpen(false);
                  }}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </PopoverContent>
            </Popover>

            {/* Priority */}
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}
            >
              <SelectTrigger className="border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                <SelectValue placeholder={t("priority")} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <SelectItem className="capitalize focus:bg-gray-100 dark:focus:bg-gray-700" value="low">
                  {t("low")}
                </SelectItem>
                <SelectItem className="capitalize focus:bg-gray-100 dark:focus:bg-gray-700" value="medium">
                  {t("medium")}
                </SelectItem>
                <SelectItem className="capitalize focus:bg-gray-100 dark:focus:bg-gray-700" value="high">
                  {t("high")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ticket Table */}
        <div className="overflow-x-auto rounded-md border border-[#CDE9FE] dark:border-gray-700">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3">{t("ticketID")}</th>
                <th className="p-3">{t("priority")}</th>
                <th className="p-3">{t("subject")}</th>
                <th className="p-3">{t("createdOn")}</th>
                <th className="p-3">{t("lastUpdate")}</th>
                <th className="p-3">{t("status")}</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading State */}
              {loading && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-primary bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      {t("loading")}...
                    </div>
                  </td>
                </tr>
              )}

              {/* No Tickets State */}
              {!loading && tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500 bg-white dark:bg-gray-800">
                    No tickets found
                  </td>
                </tr>
              )}

              {/* Ticket Rows */}
              {!loading &&
                tickets.length > 0 &&
                tickets.map((ticket) => (
                  <tr
                    key={ticket.ticketId}
                    onClick={() => setSelectedTicket(ticket)}
                    className="border-b dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-gray-800"
                  >
                    <td className="p-3">{ticket.ticketId}</td>
                    <td className="p-3 capitalize">{ticket.priority}</td>
                    <td className="p-3">{ticket.subject}</td>
                    <td className="p-3">
                      {format(new Date(ticket.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="p-3">
                      {format(new Date(ticket.updatedAt), "dd MMM yyyy")}
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "px-3 py-1 rounded text-xs capitalize",
                          ticket.status === "open" &&
                          "border border-[#00B625] text-[#00B625]",
                          ticket.status === "pending" &&
                          "border border-[#B69B00] text-[#B69B00]",
                          ticket.status === "closed" &&
                          "border border-primary text-primary"
                        )}
                      >
                        {t(ticket.status.toLowerCase())}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <TicketDetailModal
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
        />

        <CreateTicketModal
          isNewTicketOpen={isNewTicketOpen}
          setIsNewTicketOpen={setIsNewTicketOpen}
        />
      </div>
    </div>
  );
}
