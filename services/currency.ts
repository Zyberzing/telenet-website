import { fetcher } from "@/lib/fetcher";
import { Currency, CurrencyListResponse } from "@/lib/types";

const DEFAULT_CURRENCY: Currency = {
  _id: "usd",
  country: "United States",
  currency: "USD",
  rate: 1,
  symbol: "$",
};

const normalizeCurrency = (
  item: Partial<Currency> & Record<string, unknown>,
): Currency => {
  const currency =
    String(item.currency || item.currencyCode || "USD").toUpperCase();
  const country = String(item.country || item.countryName || currency);
  const rawRate = Number(
    item.rate ?? item.price ?? item.exchangeRate ?? item.value ?? 1,
  );

  return {
    _id: String(item._id || item.id || currency),
    country,
    currency,
    rate: Number.isFinite(rawRate) && rawRate > 0 ? rawRate : 1,
    symbol: typeof item.symbol === "string" ? item.symbol : undefined,
  };
};

export const getCurrencyList = async (): Promise<Currency[]> => {
  try {
    const response = await fetcher<CurrencyListResponse>(
      "/currency/website-currency-list",
    );

    const rawList = Array.isArray(response?.data)
      ? response.data
      : response?.data?.result;

    if (!Array.isArray(rawList) || rawList.length === 0) {
      return [DEFAULT_CURRENCY];
    }

    const normalized = rawList.map((item) =>
      normalizeCurrency(item as Partial<Currency> & Record<string, unknown>),
    );

    const hasUsd = normalized.some((item) => item.currency === "USD");
    return hasUsd ? normalized : [DEFAULT_CURRENCY, ...normalized];
  } catch (error) {
    console.error("Failed to fetch currency list:", error);
    return [DEFAULT_CURRENCY];
  }
};

export const DEFAULT_WEBSITE_CURRENCY = DEFAULT_CURRENCY;
