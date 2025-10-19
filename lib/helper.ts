type CountryPricing = {
  symbol: string;
  rate: number;
};

export const COUNTRY_PRICING: Record<string, CountryPricing> = {
  "United States": { symbol: "$", rate: 1 },
  "United Kingdom": { symbol: "£", rate: 0.8 },
  Canada: { symbol: "C$", rate: 1.35 },
  Australia: { symbol: "A$", rate: 1.55 },
};
