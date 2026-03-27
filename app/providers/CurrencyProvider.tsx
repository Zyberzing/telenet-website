"use client";

import { Currency } from "@/lib/types";
import {
  DEFAULT_WEBSITE_CURRENCY,
  getCurrencyList,
} from "@/services/currency";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CurrencyContextValue = {
  currencies: Currency[];
  selectedCurrency: Currency;
  loading: boolean;
  setCurrencyByCode: (currencyCode: string) => void;
  convertAmount: (amount: number | string | null | undefined) => number;
  formatAmount: (
    amount: number | string | null | undefined,
    options?: Intl.NumberFormatOptions,
  ) => string;
};

const STORAGE_KEY = "website-currency";

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);

const parseAmount = (amount: number | string | null | undefined): number => {
  if (typeof amount === "number") {
    return Number.isFinite(amount) ? amount : 0;
  }

  if (typeof amount === "string") {
    const parsed = Number(amount.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const isValidIntlCurrencyCode = (currencyCode: string | undefined): boolean => {
  const normalizedCode = currencyCode?.trim().toUpperCase();

  if (!normalizedCode || !/^[A-Z]{3}$/.test(normalizedCode)) {
    return false;
  }

  try {
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: normalizedCode,
    });
    return true;
  } catch {
    return false;
  }
};

const formatFallbackAmount = (
  amount: number,
  currency: Currency,
  options?: Intl.NumberFormatOptions,
): string => {
  const numberText = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
  const label = currency.symbol || currency.currency || "USD";

  return `${label} ${numberText}`;
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>([
    DEFAULT_WEBSITE_CURRENCY,
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    DEFAULT_WEBSITE_CURRENCY,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCurrencies = async () => {
      setLoading(true);
      const fetchedCurrencies = await getCurrencyList();

      if (!mounted) {
        return;
      }

      setCurrencies(fetchedCurrencies);

      const savedCurrencyCode =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;

      const nextSelected =
        fetchedCurrencies.find(
          (item) => item.currency === savedCurrencyCode?.toUpperCase(),
        ) ||
        fetchedCurrencies.find((item) => item.currency === "USD") ||
        fetchedCurrencies[0] ||
        DEFAULT_WEBSITE_CURRENCY;

      setSelectedCurrency(nextSelected);
      setLoading(false);
    };

    void loadCurrencies();

    return () => {
      mounted = false;
    };
  }, []);

  const setCurrencyByCode = (currencyCode: string) => {
    const nextCurrency = currencies.find(
      (item) => item.currency === currencyCode.toUpperCase(),
    );

    if (!nextCurrency) {
      return;
    }

    setSelectedCurrency(nextCurrency);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextCurrency.currency);
    }
  };

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currencies,
      selectedCurrency,
      loading,
      setCurrencyByCode,
      convertAmount: (amount) =>
        parseAmount(amount) * (selectedCurrency.rate || 1),
      formatAmount: (amount, options) => {
        const convertedAmount =
          parseAmount(amount) * (selectedCurrency.rate || 1);
        const currencyCode = selectedCurrency.currency?.trim().toUpperCase();

        if (!isValidIntlCurrencyCode(currencyCode)) {
          return formatFallbackAmount(
            convertedAmount,
            selectedCurrency,
            options,
          );
        }

        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currencyCode,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...options,
        }).format(convertedAmount);
      },
    }),
    [currencies, loading, selectedCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
}
