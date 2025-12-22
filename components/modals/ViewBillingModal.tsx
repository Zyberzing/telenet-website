"use client";

import { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BillingModalProps {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
}

export default function BillingModal({
  open,
  plan,
  onClose,
}: BillingModalProps) {
  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{plan.package_name}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500">Order ID: {plan.orderId}</p>

        <div className="space-y-2 text-sm mt-4">
          <p>
            Data:{" "}
            {plan.package_data >= 1024
              ? `${(plan.package_data / 1024).toFixed(2)} GB`
              : `${plan.package_data} MB`}
          </p>
          <p>SMS: {plan.package_sms}</p>
          <p>Call: {plan.package_call}</p>
          <p>Validity: {plan.perioddays} days</p>
          <p>Gross Amount: {plan.unit_price_gross_amount}</p>
          <p>Net Amount: {plan.unit_price_net_amount}</p>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-primary text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
