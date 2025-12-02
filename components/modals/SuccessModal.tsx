// components/topup/SuccessDialog.tsx
"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type SuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
};

export default function SuccessModal({
  open,
  onOpenChange,
  transactionId,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-8 text-center rounded-3xl shadow-2xl border-0">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Success Checkmark */}
          <div className="relative">
            <div className="p-4 rounded-full bg-green-100">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-5xl font-light">✓</span>
              </div>
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <DialogTitle className="text-3xl font-medium text-gray-900 dark:text-white">
              Payment Successful!
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Your top-up has been processed successfully.
            </p>
            <p className="text-xs text-gray-500 font-mono mt-3">
              Transaction ID: <span className="font-bold">{transactionId}</span>
            </p>
          </div>

          {/* Action Button */}
          <Button
            className="mt-6 w-full max-w-xs bg-primary hover:bg-purple-700 text-white rounded-full py-6 text-base font-medium transition-all ark:bg-primary dark:text-black"
            onClick={() => onOpenChange(false)}
          >
            Go to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}