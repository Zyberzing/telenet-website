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
import { Label } from "@radix-ui/react-dropdown-menu";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

interface Ticket {
  id: string;
  priority: string;
  subject: string;
  createdOn: string;
  lastUpdate: string;
  status: string;
  description?: string;
}

interface SupportClientProps {
  tickets: Ticket[];
}

export default function Support({ tickets }: SupportClientProps) {
  const t = useTranslations("Support");
  const [tab, setTab] = useState<"Open" | "Pending" | "Resolved">("Open");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  //   const tickets: Ticket[] = [
  //     {
  //       id: "#2056",
  //       priority: "Low",
  //       subject: "Unable to Activate",
  //       createdOn: "12 Mar 25",
  //       lastUpdate: "14 Mar 25",
  //       status: "Open",
  //       description: "User unable to activate SIM after purchase.",
  //     },
  //     {
  //       id: "#2050",
  //       priority: "Medium",
  //       subject: "Refund Request",
  //       createdOn: "11 Mar 25",
  //       lastUpdate: "13 Mar 25",
  //       status: "Pending",
  //       description: "Customer requested a refund due to duplicate order.",
  //     },
  //     {
  //       id: "#2040",
  //       priority: "Urgent",
  //       subject: "Billing Issue",
  //       createdOn: "10 Mar 25",
  //       lastUpdate: "12 Mar 25",
  //       status: "Resolved",
  //       description: "Incorrect billing applied to the user’s plan.",
  //     },
  //   ];

  const filteredTickets = tickets.filter((t) => t.status === tab);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
        <div className="flex justify-between space-x-2 mb-8">
          <div className="flex gap-2">
            {["Open", "Pending", "Resolved"].map((status) => (
              <Button
                key={status}
                variant={tab === status ? "default" : "outline"}
                onClick={() =>
                  setTab(status as "Open" | "Pending" | "Resolved")
                }
                className={cn(
                  tab === status
                    ? "bg-primary text-white hover:bg-primary border border-primary"
                    : "border-primary border"
                )}
              >
                {t(status.toLowerCase())}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setIsNewTicketOpen(true)}
            className="ml-4 bg-primary text-white hover:bg-primary text-sm"
          >
            <IoIosAddCircleOutline /> {t("raiseTicket")}
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <p className="text-lg">{t("ticketList")}</p>
          <Input placeholder={t("search")} className="max-w-52" />
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm">{t("filter")}</span>
              <Image src="/filter.svg" alt="Filter" height={14} width={15} />
            </div>
            <Select>
              <SelectTrigger className="border border-primary">
                <SelectValue placeholder={t("filterDate")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("newest")}</SelectItem>
                <SelectItem value="oldest">{t("oldest")}</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="border border-primary">
                <SelectValue placeholder={t("priority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("low")}</SelectItem>
                <SelectItem value="medium">{t("medium")}</SelectItem>
                <SelectItem value="urgent">{t("urgent")}</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="border border-primary">
                <SelectValue placeholder={t("subject")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activation">{t("activation")}</SelectItem>
                <SelectItem value="refund">{t("refund")}</SelectItem>
                <SelectItem value="billing">{t("billing")}</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="border border-primary">
                <SelectValue placeholder={t("keywords")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activation">{t("activation")}</SelectItem>
                <SelectItem value="refund">{t("refund")}</SelectItem>
                <SelectItem value="billing">{t("billing")}</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="border border-primary">
                <SelectValue placeholder={t("provider")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activation">{t("activation")}</SelectItem>
                <SelectItem value="refund">{t("refund")}</SelectItem>
                <SelectItem value="billing">{t("billing")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ticket List */}
        <div className="overflow-x-auto rounded-md border border-[#CDE9FE]">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3 font-[500]">{t("ticketID")}</th>
                <th className="p-3 font-[500]">{t("priority")}</th>
                <th className="p-3 font-[500]">{t("subject")}</th>
                <th className="p-3 font-[500]">{t("createdOn")}</th>
                <th className="p-3 font-[500]">{t("lastUpdate")}</th>
                <th className="p-3 font-[500]">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="border-b hover:bg-purple-50 cursor-pointer"
                >
                  <td className="p-3 font-[400]">{ticket.id}</td>
                  <td className="p-3">{ticket.priority}</td>
                  <td className="p-3">{ticket.subject}</td>
                  <td className="p-3">{ticket.createdOn}</td>
                  <td className="p-3">{ticket.lastUpdate}</td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "px-3 py-1 rounded text-xs font-[400]",
                        ticket.status === "Open" &&
                          "border border-[#00B625] text-[#00B625]",
                        ticket.status === "Pending" &&
                          "border border-[#B69B00] text-[#B69B00]",
                        ticket.status === "Resolved" &&
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

        {/* Ticket Details Dialog */}
        <Dialog
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
        >
          <DialogContent className="max-w-lg border-0" showCloseButton={false}>
            {selectedTicket && (
              <>
                <div className="flex justify-between sticky top-0 z-10">
                  <DialogTitle className="text-[#141414] text-[28px] font-[400]">
                    {selectedTicket.id}
                  </DialogTitle>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-500 hover:text-red-500 text-3xl font-[400px] cursor-pointer self-start"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-[#525252] text-[13px]">
                  {t("priority")} {selectedTicket.priority} |{t("createdOn")}{" "}
                  {selectedTicket.createdOn}
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[16px] text-[#202020] font-[400]">
                      {t("writeComment")}
                    </label>
                    <textarea
                      placeholder={t("writeDescription")}
                      className="w-full mt-1 border rounded-md p-2"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[16px] text-[#202020] font-[400] mb-1">
                      {t("attachFile")}:
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log("Selected file:", file.name);
                        }
                      }}
                    />

                    <Button
                      type="button"
                      className="w-1/2"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      {t("upload")}
                    </Button>
                  </div>
                </div>
              </>
            )}
            <DialogFooter
              className="mt-4 w-full "
              style={{ justifyContent: "center" }}
            >
              <Button className="py-6 bg-primary text-white hover:bg-primary w-1/2 rounded-full">
                {t("saveChanges")}
              </Button>
              <Button
                className="py-6 w-1/2 rounded-full bg-black"
                onClick={() => setSelectedTicket(null)}
              >
                {t("cancel")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Raise Ticket Dialog */}
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogContent
            showCloseButton={false}
            className="max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-lg border-0"
          >
            <div className="flex justify-between sticky top-0 z-10">
              <DialogTitle className="text-[#141414] text-[24px] font-[400]">
                {t("raiseTicket")}
              </DialogTitle>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="text-gray-500 hover:text-red-500 text-3xl font-[400px] cursor-pointer self-start"
              >
                &times;
              </button>
            </div>
            <hr />
            <form className="space-y-3 overflow-y-auto px-2">
              <Label className="text-[#202020] text-[14px]">{t("name")}</Label>
              <Input placeholder={t("placeholderName")} />
              <Label className="text-[#202020] text-[14px]">{t("email")}</Label>
              <Input placeholder={t("placeholderEmail")} />
              <Label className="text-[#202020] text-[14px]">{t("phone")}</Label>
              <Input placeholder={t("placeholderPhone")} />
              <Label className="text-[#202020] text-[14px]">
                {t("subject")}
              </Label>
              <Input placeholder={t("placeholderSubject")} />
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-[#202020] text-[14px] mb-1">
                    {t("category")}
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activation">
                        {t("activation")}
                      </SelectItem>
                      <SelectItem value="refund">{t("refund")}</SelectItem>
                      <SelectItem value="billing">{t("billing")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-[#202020] text-[14px] mb-1">
                    {t("priority")}
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("low")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem aria-selected value="low">
                        {t("low")}
                      </SelectItem>
                      <SelectItem value="medium">{t("medium")}</SelectItem>
                      <SelectItem value="urgent">{t("urgent")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Label className="text-[#202020] text-[14px] mb-1">
                {t("description")}
              </Label>
              <textarea
                className="w-full border rounded-md p-2"
                placeholder={t("writeDescription")}
                rows={3}
              ></textarea>

              <div className="flex flex-col gap-1">
                <label className="text-sm mb-1 font-[400]">
                  {t("attachFile")}
                </label>

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("Selected file:", file.name);
                    }
                  }}
                />

                <Button
                  type="button"
                  className="w-1/2"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  {t("upload")}
                </Button>
              </div>
            </form>
            <DialogFooter
              className="mt-4 w-full"
              style={{ justifyContent: "center" }}
            >
              <Button className="py-6 bg-primary text-white hover:bg-primary w-1/2 rounded-full">
                {t("submitTicket")}
              </Button>
              <Button
                className="py-6 w-1/2 rounded-full bg-black"
                onClick={() => setIsNewTicketOpen(false)}
              >
                {t("cancel")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
