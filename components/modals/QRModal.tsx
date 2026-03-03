"use client";

import { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export default function QRModal({ open, onClose, plan }: QRModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>

        {plan?.qrcode ? (
          <>
            {isLoading && (
              <p className="text-sm text-gray-500">
                <Loader2 className="animate-spin" /> Loading QR code...
              </p>
            )}
            <Image
              src={plan.qrcode}
              alt="QR Code"
              width={220}
              height={220}
              className="mx-auto"
              onLoadingComplete={() => setIsLoading(false)}
            />
          </>
        ) : (
          <p className="text-sm text-gray-500">QR code not available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
