import { Plan } from "@/lib/types";
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
    data_size?: number;
    max_validity?: number;
    plan_name?: number;
  }>;
}

const DEFAULT_DATA_SIZE = 50;
const DEFAULT_PLAN_TYPE = 1;

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

export default async function Page({
  searchParams,
}: PageProps) {
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
    filterby === "Country" ? (query.country_code ?? countries[0]?.iso2 ?? "") : "";
  const selectedRegion =
    filterby === "Region" ? (query.region_name ?? regions[0]?.name ?? "") : "";
  const selectedDataSize = query.data_size
    ? Number(query.data_size)
    : DEFAULT_DATA_SIZE;
  const selectedMaxValidity =
    query.max_validity && Number(query.max_validity);
  const selectedPlanType = query.plan_name
    ? Number(query.plan_name)
    : DEFAULT_PLAN_TYPE;

  let initialPlans: Plan[] = [];

  if (
    (filterby === "Country" && selectedCountryCode) ||
    (filterby === "Region" && selectedRegion)
  ) {
    try {
      const plansData = await getPlans({
        filterby,
        country_code: filterby === "Country" ? selectedCountryCode : undefined,
        region_name: filterby === "Region" ? selectedRegion : undefined,
        data_size: selectedDataSize,
        max_validity: selectedMaxValidity,
        plan_name: selectedPlanType,
      });

      initialPlans = plansData?.plans || [];
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
      selectedCountry={selectedCountryCode}
      selectedRegion={selectedRegion}
      filterby={filterby}
      planType={selectedPlanType}
      userProfile={profile}
    />
  );
}
