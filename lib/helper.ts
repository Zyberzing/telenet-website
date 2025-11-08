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

export const formatDataSize = (dataMB: string | number) => {
  const mb = Number(dataMB);
  if (mb >= 1024) {
    const gb = parseFloat((mb / 1024).toFixed(2));
    return gb % 1 === 0 ? `${gb} GB` : `${gb} GB`; // trailing .00 removed
  }
  return `${mb} MB`;
};

