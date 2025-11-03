"use client";

import {
  useGetCountriesMutation,
  useGetPlansMutation,
  useGetRegionsMutation,
} from "@/services/plansApi";
import { useEffect, useState } from "react";
import Plans from "./Plans";

export default function Page() {
  const [getCountries, { data: countriesData }] = useGetCountriesMutation();
  const [getRegions, { data: regionsData }] = useGetRegionsMutation();
  const [getPlans, { data: plansData }] = useGetPlansMutation();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // ✅ Fetch countries & regions initially
  useEffect(() => {
    getCountries(null);
    getRegions(null);
  }, [getCountries, getRegions]);

  // ✅ Auto-select first items only when both are available
  useEffect(() => {
    const countries = countriesData?.data || [];
    const regions = regionsData?.data || [];

    if (
      countries.length > 0 &&
      regions.length > 0 &&
      !selectedCountry &&
      !selectedRegion
    ) {
      const firstCountry = countries[0].name;
      const firstRegion = regions[0].name;

      // Set both at once
      setSelectedCountry(firstCountry);
      setSelectedRegion(firstRegion);
    }
  }, [countriesData, regionsData, selectedCountry, selectedRegion]);

  // ✅ Fetch plans only when both selectedCountry & selectedRegion are set
  useEffect(() => {
    if (selectedCountry && selectedRegion) {
      console.log("📡 Fetching plans with:", {
        country_code: selectedCountry,
        region_name: selectedRegion,
      });

      getPlans({
        country_code: selectedCountry,
        region_name: selectedRegion,
      });
    }
  }, [getPlans, selectedCountry, selectedRegion]);

  return (
    <Plans
      countries={countriesData?.data || []}
      regions={regionsData?.data || []}
      plans={plansData?.data?.plans || []}
      selectedCountry={selectedCountry}
      selectedRegion={selectedRegion}
      setSelectedCountry={setSelectedCountry}
      setSelectedRegion={setSelectedRegion}
    />
  );
}

