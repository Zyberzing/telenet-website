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

  const filterby = params.filterby ?? "Country";
  const selectedCountryCode = params.country_code ?? "";
  const selectedRegion = params.region_name ?? "";
  const selectedDataSize = params.data_size ? Number(params.data_size) : 50;
  const selectedMaxValidity =
    params.max_validity && Number(params.max_validity);
  const selectedPlanType = params.plan_name ? Number(params.plan_name) : 1;

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
