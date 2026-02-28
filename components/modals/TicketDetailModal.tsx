import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket } from "@/lib/types";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function TicketDetailModal({
  selectedTicket,
  setSelectedTicket,
}: {
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
}) {
  const t = useTranslations("Support");
  const description = useMemo(
    () => selectedTicket?.description || "-",
    [selectedTicket],
  );

  return (
    <Dialog
      open={!!selectedTicket}
      onOpenChange={() => setSelectedTicket(null)}
    >
      <DialogContent
        className="max-w-lg border-0 flex flex-col max-h-[85vh]"
        showCloseButton={false}
      >
        {selectedTicket && (
          <>
            <DialogHeader className="flex flex-row items-start justify-between space-y-0">
              <DialogTitle>
                #{selectedTicket.ticketId}
                <p className="mb-4 text-sm mt-2">
                  {t("priority")} {selectedTicket.priority} | {t("createdOn")}{" "}
                  {format(new Date(selectedTicket.createdAt), "dd MMM yyyy")}
                </p>
              </DialogTitle>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-500 hover:text-red-500 text-3xl cursor-pointer"
              >
                &times;
              </button>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 mb-1 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("ticketID")}
                    </p>
                    <p className="break-words">
                      {selectedTicket.ticketId || "-"}
                    </p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">{t("status")}</p>
                    <p className="capitalize break-words">
                      {selectedTicket.status || "-"}
                    </p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("priority")}
                    </p>
                    <p className="capitalize break-words">
                      {selectedTicket.priority || "-"}
                    </p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">{t("subject")}</p>
                    <p className="break-words">
                      {selectedTicket.subject || "-"}
                    </p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("createdOn")}
                    </p>
                    <p>
                      {selectedTicket.createdAt
                        ? format(
                            new Date(selectedTicket.createdAt),
                            "dd MMM yyyy",
                          )
                        : "-"}
                    </p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("lastUpdate")}
                    </p>
                    <p>
                      {selectedTicket.updatedAt
                        ? format(
                            new Date(selectedTicket.updatedAt),
                            "dd MMM yyyy",
                          )
                        : "-"}
                    </p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">{t("name")}</p>
                    <p className="break-words">{selectedTicket.name || "-"}</p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">{t("email")}</p>
                    <p className="break-words">{selectedTicket.email || "-"}</p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 mb-1">{t("phone")}</p>
                    <p className="break-words">
                      {[selectedTicket.countryCode, selectedTicket.phoneNumber]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </p>
                  </div>
                </div>

                <div className="w-full border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 mb-1">
                    {t("description")}
                  </p>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {description}
                  </p>
                </div>

                {/* <label className="me-1">{t("attachFile")}</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      document.getElementById("detail-file-upload")?.click()
                    }
                  >
                    {file ? file?.name : t("upload")}
                  </Button>

                  <input
                    id="detail-file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />

                  {file ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Uploaded file preview"
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  ) : selectedTicket.document ? (
                    <Image
                      src={selectedTicket.document}
                      alt="Ticket document"
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  ) : null}
                </div> */}
              </div>
            </div>
          </>
        )}

        <DialogFooter className="justify-center gap-2 pt-4">
          <Button
            className="py-6 w-full rounded-full bg-black dark:bg-white dark:text-black"
            onClick={() => setSelectedTicket(null)}
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
