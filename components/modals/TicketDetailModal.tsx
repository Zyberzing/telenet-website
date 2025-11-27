import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader, // Import DialogHeader
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket } from "@/lib/types";
import { updateTicket } from "@/services/ticket";
import { uploadMedia } from "@/services/upload";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

export default function TicketDetailModal({
  selectedTicket,
  setSelectedTicket,
}: {
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
}) {
  const t = useTranslations("Support");
  const [description, setDescription] = useState(
    selectedTicket?.description || ""
  );
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  console.log("selectedTicket", selectedTicket);
  useEffect(() => {
    setDescription(selectedTicket?.description || "");
  }, [selectedTicket]);

  const handleSave = async () => {
    if (!selectedTicket) return;

    setLoading(true); // start loading

    try {
      let documentUrl = selectedTicket.document || null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await uploadMedia(formData);
        documentUrl = uploadRes?.data?.httpsUrl ?? null;
      }

      const ticketId = selectedTicket._id ?? selectedTicket.id;

      const updateBody = {
        ticketId,
        description,
        document: documentUrl,
      };

      const res = await updateTicket(updateBody);

      toast.success(res.message || "Updated successfully");

      setSelectedTicket(null); // close modal
    } catch (err: unknown) {
      console.error("Update error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // stop loading
    }
  };

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
              <div className="space-y-3 mb-1">
                <textarea
                  className="w-full mt-1 border rounded-md p-2"
                  rows={3}
                  placeholder={t("writeDescription")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <label className="me-1">{t("attachFile")}</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      document.getElementById("detail-file-upload")?.click()
                    }
                  >
                    {file ? file?.name : t("upload")}
                  </Button>

                  {/* REQUIRED HIDDEN INPUT */}
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
                </div>
              </div>
            </div>
          </>
        )}

        <DialogFooter className="justify-center gap-2 pt-4">
          <Button
            className="py-6 bg-primary text-white w-1/2 rounded-full"
            onClick={handleSave}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mx-auto" /> Loading...
              </>
            ) : (
              t("saveChanges")
            )}
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
  );
}
