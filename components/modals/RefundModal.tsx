"use client";

import type { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Refund } from "@/lib/types";
import { createRefund } from "@/services/refund";
import { crateTicket } from "@/services/ticket";
import { sendTicketConversationMessage } from "@/services/ticketConversation";
import { useState } from "react";
import { toast } from "sonner";

interface RefundModalProps {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
  onRefundSuccess: () => void;
}

export default function RefundModal({
  open,
  plan,
  onClose,
  onRefundSuccess,
}: RefundModalProps) {
  const [refundComment, setRefundComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!plan || !refundComment.trim()) {
      toast.error("Please enter refund reason");
      return;
    }

    const payload: Refund = {
      orderId: plan.orderId,
      reason: refundComment,
    };
    setLoading(true);

    try {
      const refundRes = await createRefund(payload);
      const refundData = refundRes?.data?.createTicketPayload;
      console.log("refund", refundRes, refundData);
      if (refundData) {
        const ticketRes = await crateTicket({
          subject: refundData.subject ?? "",
          description: refundData.description ?? "",
          // document: refundData.document ?? null,
          category: refundData.category ?? "",
        });
        const createChatForAdmin = await sendTicketConversationMessage(
          ticketRes?.data?._id,
          refundData?.description,
        );

        console.log("ticket", ticketRes, "chat create", createChatForAdmin);
      }
      toast.success(refundRes.message || "Refund initiated successfully");
      onClose();
      onRefundSuccess();
      setRefundComment("");
    } catch (err: any) {
      toast.error(err.message || "Refund failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refund Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p>
            Order ID: <span className="font-medium">{plan?.orderId}</span>
          </p>

          <textarea
            value={refundComment}
            onChange={(e) => setRefundComment(e.target.value)}
            placeholder="Enter refund reason"
            rows={4}
            className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || !refundComment.trim()}
            className="bg-primary text-white"
          >
            {loading ? "Submitting..." : "Submit Refund"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
