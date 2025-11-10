import { getProfile } from "@/services/authApi";
import { getCountries, getPlans, getRegions } from "@/services/plansApi";
import { Metadata } from "next";
import Plans, { AdminMarkup, Plan } from "./Plans";

export type countryItems = {
  _id: string;
  name: string;
};

export type regionItems = {
  _id: string;
  name: string;
};

interface PageProps {
  searchParams: Promise<{
    country?: string;
    region?: string;
    data_size?: number;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const country = params.country;
  const region = params.region;

  let title = "eSIM Plans - Telenet";
  let description = "Browse and purchase eSIM plans for global connectivity.";

  if (country && region) {
    title = `eSIM Plans for ${country} - ${region} | Telenet`;
    description = `Find the best eSIM plans for ${country} in the ${region} region. Instant activation, global coverage, and competitive prices.`;
  } else if (country) {
    title = `eSIM Plans for ${country} | Telenet`;
    description = `Discover eSIM plans for ${country}. Stay connected with our reliable data plans and instant activation.`;
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

  const selectedCountry = params.country || (countries[0]?.name ?? "");
  const selectedRegion = params.region || (regions[0]?.name ?? "");
  const selectedDataSize = Number(params.data_size) || 50;

  let initialPlans: Plan[] = [];
  let initialAdminMarkup: AdminMarkup | null = null;

  if (selectedCountry || selectedRegion) {
    try {
      const plansData = await getPlans({
        country_code: selectedCountry,
        region_name: selectedRegion,
        data_size: selectedDataSize,
      });
      initialPlans = plansData?.plans || [];
      initialAdminMarkup = plansData?.adminMarkup || null;
    } catch (err) {
      console.error("Failed to load plans:", err);
    }
  }

  return (
    <Plans
      countries={countries.map((c) => ({ code: c._id, name: c.name }))}
      regions={regions.map((r) => ({ name: r.name }))}
      plans={initialPlans}
      adminMarkup={initialAdminMarkup}
      selectedCountry={selectedCountry}
      selectedRegion={selectedRegion}
      userProfile={profile}
    />
  );
}
