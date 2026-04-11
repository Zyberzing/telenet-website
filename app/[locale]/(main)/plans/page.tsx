import { Pagination, Plan } from "@/lib/types";
import { getProfile } from "@/services/auth";
import { getCountries, getPlans, getRegions } from "@/services/plansApi";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

const toPlanType = (value?: string): 0 | 1 | null => {
  if (value === "0") return 0;
  if (value === "1") return 1;
  return DEFAULT_PLAN_TYPE;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps & { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Plans" });
  const query = await searchParams;
  const filterby = query.filterby || "Country";
  const country = query.country_code;
  const region = query.region_name;

  let title = t("metaTitleDefault");
  let description = t("metaDescriptionDefault");

  if (filterby === "Region" && region) {
    title = t("metaTitleRegion", { region });
    description = t("metaDescriptionRegion", { region });
  } else if (filterby === "Country" && country) {
    title = t("metaTitleCountry", { country });
    description = t("metaDescriptionCountry", { country });
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
  const selectedPlanType = toPlanType(query.plan_name);

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
        plan_name: selectedPlanType ?? undefined, // If plan_name is explicitly 0 or 1, use it; otherwise, default to 1
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
