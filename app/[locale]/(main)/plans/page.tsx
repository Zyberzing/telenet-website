import Plans from "./Plans";

// Server-side data fetching functions
async function fetchCountries() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/plan/countries`,
      {
        method: "GET",
        cache: "no-store", // Ensure fresh data on each request
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

async function fetchRegions() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/plan/regions`,
      {
        method: "GET",
        cache: "no-store", // Ensure fresh data on each request
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch regions: ${response.status}`);
    }

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
}

async function fetchPlans(countryCode: string, regionName: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE
      }/plan/package-list?filterby=Region&country_code=${encodeURIComponent(
        countryCode
      )}&region_name=${encodeURIComponent(regionName)}`,
      {
        method: "GET",
        cache: "no-store", // Ensure fresh data on each request
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch plans: ${response.status}`);
    }

    const data = await response.json();
    return data?.data || { plans: [], adminMarkup: null };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { plans: [], adminMarkup: null };
  }
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  // Fetch countries and regions in parallel
  const [countries, regions] = await Promise.all([
    fetchCountries(),
    fetchRegions(),
  ]);

  // Await searchParams and get selected country and region from URL params or use defaults
  const params = await searchParams;
  const urlCountry = typeof params.country === "string" ? params.country : "";
  const urlRegion = typeof params.region === "string" ? params.region : "";

  const selectedCountry =
    urlCountry || (countries.length > 0 ? countries[0].name : "");
  const selectedRegion =
    urlRegion || (regions.length > 0 ? regions[0].name : "");

  // Fetch plans based on selected country and region
  let plansData = { plans: [], adminMarkup: null };
  if (selectedCountry && selectedRegion) {
    plansData = await fetchPlans(selectedCountry, selectedRegion);
  }

  return (
    <Plans
      countries={countries}
      regions={regions}
      plans={plansData.plans}
      adminMarkup={plansData.adminMarkup}
      initialSelectedCountry={selectedCountry}
      initialSelectedRegion={selectedRegion}
    />
  );
}
