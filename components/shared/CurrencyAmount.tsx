"use client";

import { useCurrency } from "@/app/providers/CurrencyProvider";

type CurrencyAmountProps = {
  amount: number | string | null | undefined;
  className?: string;
};

export default function CurrencyAmount({
  amount,
  className,
}: CurrencyAmountProps) {
  const { formatAmount } = useCurrency();

  return <span className={className}>{formatAmount(amount)}</span>;
}
