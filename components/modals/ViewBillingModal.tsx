"use client";

import { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BillingModalProps {
  open: boolean;
  plan: Plan | null;
  onClose: () => void;
}

type RawRecord = Record<string, unknown>;

const isPresent = (value: unknown) =>
  value !== null && value !== undefined && value !== "";

const toText = (value: unknown) => {
  if (!isPresent(value)) return "-";
  return String(value);
};

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toDate = (value: unknown) => {
  if (!isPresent(value)) return "-";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "-" : format(date, "dd MMM yyyy");
};

function BillingRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <p className="text-[#565656] dark:text-zinc-300">{label}</p>
      <p
        className={cn(
          "text-right text-zinc-900 dark:text-zinc-100 break-words",
          emphasized && "font-semibold",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default function BillingModal({
  open,
  plan,
  onClose,
}: BillingModalProps) {
  const { formatAmount } = useCurrency();

  if (!plan) return null;

  const order = (plan.order ?? {}) as RawRecord;
  const planSnapshot = (((plan as unknown) as RawRecord).planSnapshot ?? {}) as RawRecord;

  const firstName = toText(order.firstName);
  const lastName = toText(order.lastName);
  const hasName = firstName !== "-" || lastName !== "-";

  const summary = {
    basePrice: toNumber(planSnapshot.price) + toNumber(order.markupAmount), // ✅ merged
    tax: toNumber(order.taxAmount),
    stripeFee: toNumber(order.stripe),
    discount: toNumber(order.discountAmount),
    total: toNumber(order.finalPrice ?? plan.price),
  };

  const primaryDetails = [
    { label: "Order ID", value: toText(plan.orderId) },
    { label: "Status", value: toText(plan.status) },
    { label: "Order Date", value: toDate(order.createdAt) },
    { label: "Activation Date", value: toDate(order.activationDate) },
    { label: "Expiry Date", value: toDate(order.expiryDate) },
  ];

  const customerDetails = [
    { label: "Name", value: hasName ? `${firstName} ${lastName}`.trim() : "-" },
    { label: "Email", value: toText(order.email) },
    { label: "Phone", value: toText(order.phoneNumber) },
    { label: "Address", value: toText(order.address) },
  ];

  const planDetails = [
    { label: "Plan Name", value: toText(plan.package_name) },
    { label: "Provider", value: toText(plan.provider) },
    { label: "Data", value: toText(order.data ?? plan.package_data) },
    { label: "Network", value: toText(order.network) },
    { label: "Coverage", value: toText(order.coverage ?? plan.country) },
    { label: "Validity", value: `${toText(plan.perioddays)} days` },
  ];

  const accessoryDetails = [
    { label: "Payment Method", value: toText(order.paymentMethodType) },
    { label: "Transaction ID", value: toText(order.transactionId) },
    { label: "Invoice ID", value: toText(order.invoiceId) },
    { label: "Coupon Code", value: toText(order.couponCode) },
    { label: "Refund Status", value: toText(order.refundStatus) },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-lg border-0 bg-white dark:bg-zinc-900"
      >
        <DialogHeader className="p-5 border-b border-gray-200 dark:border-zinc-700">
          <DialogTitle className="text-xl">{plan.package_name}</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Billing Summary for order {plan.orderId}
          </p>
        </DialogHeader>

        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          <section className="rounded-2xl border border-[#E5EEF8] dark:border-zinc-700 bg-[#F8FBFF] dark:bg-zinc-800/60 p-4 space-y-2">
            <p className="text-[15px] font-semibold">Order Details</p>
            {primaryDetails.map((item) => (
              <BillingRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </section>

          <section className="rounded-2xl border border-[#E5EEF8] dark:border-zinc-700 bg-[#F8FBFF] dark:bg-zinc-800/60 p-4 space-y-2">
            <p className="text-[15px] font-semibold">Customer Details</p>
            {customerDetails.map((item) => (
              <BillingRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </section>

          <section className="rounded-2xl border border-[#E5EEF8] dark:border-zinc-700 bg-[#F8FBFF] dark:bg-zinc-800/60 p-4 space-y-2">
            <p className="text-[15px] font-semibold">Plan Details</p>
            {planDetails.map((item) => (
              <BillingRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </section>

          <section className="rounded-2xl border border-[#E5EEF8] dark:border-zinc-700 bg-[#F8FBFF] dark:bg-zinc-800/60 p-4 space-y-2">
            <p className="text-[15px] font-semibold">Accessory Details</p>
            {accessoryDetails.map((item) => (
              <BillingRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </section>

          <section className="rounded-2xl border border-[#E5EEF8] dark:border-zinc-700 bg-[#F8FBFF] dark:bg-zinc-800/60 p-4 space-y-2">
            <p className="text-[15px] font-semibold">Payment Summary</p>
            <BillingRow
              label="Base Price"
              value={formatAmount(summary.basePrice)}
            />
            <BillingRow label="Tax" value={formatAmount(summary.tax)} />
            <BillingRow
              label="Stripe Fee"
              value={formatAmount(summary.stripeFee)}
            />
            <BillingRow
              label="Discount"
              value={`-${formatAmount(summary.discount)}`}
            />
            <hr className="border-dashed border-[#D9E6F5] dark:border-zinc-600" />
            <BillingRow
              label="Total"
              value={formatAmount(summary.total)}
              emphasized
            />
          </section>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <Button
            onClick={onClose}
            className="bg-primary text-white hover:bg-primary rounded-full px-8"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
