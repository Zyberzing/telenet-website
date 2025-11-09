import { getProfile } from "@/services/authApi";
import { getCountries, getPlans, getRegions } from "@/services/plansApi";
import Plans, { AdminMarkup, Plan } from "./Plans";
import { Metadata } from "next";

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

  // Fetch all data server-side in parallel
  const [countriesData, regionsData, userProfile] = await Promise.allSettled([
    getCountries(),
    getRegions(),
    getProfile(),
  ]);

  // Extract data from settled promises
  const countries =
    countriesData.status === "fulfilled" ? countriesData.value : [];
  const regions = regionsData.status === "fulfilled" ? regionsData.value : [];
  const profile = userProfile.status === "fulfilled" ? userProfile.value : null;

  // Determine selected country and region from query params or defaults
  const selectedCountry =
    params.country || (countries.length > 0 ? countries[0]?.name || "" : "");
  const selectedRegion =
    params.region || (regions.length > 0 ? regions[0]?.name || "" : "");

  // Get initial plans for the selected country and region
  let initialPlans: Plan[] = [];
  let initialAdminMarkup: AdminMarkup | null = null;

  if (selectedCountry && selectedRegion) {
    try {
      const plansData = await getPlans({
        country_code: selectedCountry,
        region_name: selectedRegion,
      });
      initialPlans = plansData.plans || [];
      initialAdminMarkup = plansData.adminMarkup || null;
    } catch (error) {
      console.error("Error fetching initial plans:", error);
    }
  }
  console.log("initialPlans", initialPlans);

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
