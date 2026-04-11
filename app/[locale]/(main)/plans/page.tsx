import { Pagination, Plan } from "@/lib/types";
import { getProfile } from "@/services/auth";
import { getCountries, getPlans, getRegions } from "@/services/plansApi";
import { getPageMetadata } from "@/services/seo";
import Plans from "./Plans";

export type countryItems = {
  id: string;
  name: string;
  iso2: string;
  image?: string;
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
    page?: string;
    data_size?: number;
    min_validity?: string;
    max_validity?: string;
    plan_name?: string;
  }>;
}

const DEFAULT_DATA_SIZE = 50;
const DEFAULT_LIMIT = 9;
const DEFAULT_PAGE = 1;
const DEFAULT_PLAN_TYPE = 1;

const toOptionalPositiveInt = (value?: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "plans");
}

export default async function Page({ searchParams }: PageProps) {
  const query = await searchParams;

  const [countriesData, regionsData, userProfile] = await Promise.allSettled([
    getCountries(),
    getRegions(),
    getProfile(),
  ]);

  const countries =
    countriesData.status === "fulfilled" ? countriesData.value : [];
  const regions = regionsData.status === "fulfilled" ? regionsData.value : [];
  const profile = userProfile.status === "fulfilled" ? userProfile.value : null;

  const filterby = query.filterby ?? "Country";
  const selectedCountryCode =
    filterby === "Country"
      ? (query.country_code ?? countries[0]?.iso2 ?? "")
      : "";
  const selectedRegion =
    filterby === "Region" ? (query.region_name ?? regions[0]?.name ?? "") : "";
  const selectedPage = Math.max(1, Number(query.page ?? DEFAULT_PAGE) || 1);
  const selectedDataSize = query.data_size
    ? Number(query.data_size)
    : DEFAULT_DATA_SIZE;
  const selectedMinValidity = toOptionalPositiveInt(query.min_validity);
  const selectedMaxValidity = toOptionalPositiveInt(query.max_validity);
  const selectedPlanType = query.plan_name
    ? Number(query.plan_name)
    : DEFAULT_PLAN_TYPE;

  let initialPlans: Plan[] = [];
  let initialPagination: Pagination | null = null;

  if (
    (filterby === "Country" && selectedCountryCode) ||
    (filterby === "Region" && selectedRegion)
  ) {
    try {
      const plansData = await getPlans({
        filterby,
        country_code: filterby === "Country" ? selectedCountryCode : undefined,
        region_name: filterby === "Region" ? selectedRegion : undefined,
        page: selectedPage,
        limit: DEFAULT_LIMIT,
        data_size: selectedDataSize,
        min_validity: selectedMinValidity,
        max_validity: selectedMaxValidity,
        plan_name: selectedPlanType,
      });

      initialPlans = plansData?.plans || [];
      initialPagination = plansData?.pagination || null;
    } catch (err) {
      console.error("Failed to load plans:", err);
    }
  }

  return (
    <Plans
      countries={countries.map((c) => ({
        iso2: c.iso2,
        code: c.id,
        name: c.name,
      }))}
      regions={regions.map((r) => ({ name: r.name }))}
      result={initialPlans}
      pagination={initialPagination}
      selectedCountry={selectedCountryCode}
      selectedRegion={selectedRegion}
      filterby={filterby}
      planType={selectedPlanType}
      userProfile={profile}
    />
  );
}
