"use client";

import { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export default function QRModal({ open, onClose, plan }: QRModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>

        {plan?.qrcode ? (
          <Image
            src={plan.qrcode}
            alt="QR Code"
            width={220}
            height={220}
            className="mx-auto"
          />
        ) : (
          <p className="text-sm text-gray-500">QR code not available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
