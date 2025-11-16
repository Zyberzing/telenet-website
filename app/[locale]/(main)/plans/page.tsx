import { getProfile } from "@/services/authApi";
import { getCountries, getPlans, getRegions } from "@/services/plansApi";
import { Metadata } from "next";
import Plans, { Plan } from "./Plans";

export type countryItems = {
  id: string;
  name: string;
  iso2: string;
};

export type regionItems = {
  id: string;
  name: string;
};

interface PageProps {
  searchParams: Promise<{
    filterby?: "Country" | "Region";
    country_code?: string;
    region_name?: string;
    data_size?: number;
    plan_name?: number;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const filterby = params.filterby || "Country";
  const country = params.country_code;
  const region = params.region_name;

  let title = "eSIM Plans - Telenet";
  let description = "Browse and purchase eSIM plans for global connectivity.";

  if (filterby === "Region" && region) {
    title = `eSIM Plans for ${region} Region | Telenet`;
    description = `Find the best eSIM plans available in the ${region} region.`;
  } else if (filterby === "Country" && country) {
    title = `eSIM Plans for ${country} | Telenet`;
    description = `Discover eSIM plans for ${country}. Stay connected globally with instant activation.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const [countriesData, regionsData, userProfile] = await Promise.allSettled([
    getCountries(),
    getRegions(),
    getProfile(),
  ]);

  const countries =
    countriesData.status === "fulfilled" ? countriesData.value : [];
  const regions = regionsData.status === "fulfilled" ? regionsData.value : [];
  const profile = userProfile.status === "fulfilled" ? userProfile.value : null;

  const filterby = params.filterby || "Country"; // Default always Country
  const selectedCountryCode = params.country_code || countries[0]?.iso2 || "";
  const selectedRegion = params.region_name || regions[0]?.name || "";
  const selectedDataSize = Number(params.data_size) || 50;
  const selectedPlanType = Number(params.plan_name) || 1;

  let initialPlans: Plan[] = [];

  try {
    const plansData = await getPlans({
      filterby,
      country_code: filterby === "Country" ? selectedCountryCode : undefined,
      region_name: filterby === "Region" ? selectedRegion : undefined,
      data_size: selectedDataSize,
      plan_name: selectedPlanType,
    });
    initialPlans = plansData?.plans || [];
  } catch (err) {
    console.error("Failed to load plans:", err);
  }

  return (
    <Plans
      countries={countries.map((c) => ({
        iso2: c.iso2,
        code: c.id,
        name: c.name,
      }))}
      regions={regions.map((r) => ({ name: r.name }))}
      plans={initialPlans}
      selectedCountry={selectedCountryCode}
      selectedRegion={selectedRegion}
      filterby={filterby}
      planType={selectedPlanType}
      userProfile={profile}
    />
  );
}
