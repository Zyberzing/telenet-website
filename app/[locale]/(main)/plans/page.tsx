"use client";

import { getProfile } from "@/services/authApi";
import { getCountries, getPlans, getRegions } from "@/services/plansApi";
import { useEffect, useState } from "react";
import { User } from "../profile-setting/ProfileSetting";
import Plans, { AdminMarkup, Plan } from "./Plans";

export type countryItems = {
  _id: string;
  name: string;
};

export type regionItems = {
  _id: string;
  name: string;
};

export default function Page() {
  const [countries, setCountries] = useState<countryItems[]>([]);
  const [regions, setRegions] = useState<regionItems[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [adminMarkup, setAdminMarkup] = useState<AdminMarkup | null>(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch countries & regions initially
  useEffect(() => {
    const fetchCountriesAndRegions = async () => {
      const countriesData = (await getCountries()) || [];
      const regionsData = (await getRegions()) || [];

      setCountries(countriesData);
      setRegions(regionsData);

      if (countriesData.length > 0 && regionsData.length > 0) {
        setSelectedCountry(countriesData[0]?.name || "");
        setSelectedRegion(regionsData[0]?.name || "");
      }
    };

    fetchCountriesAndRegions();
  }, []);

  // Fetch plans when selectedCountry & selectedRegion are set
  useEffect(() => {
    if (!selectedCountry || !selectedRegion) return;

    const fetchPlansData = async () => {
      const plansData = await getPlans({
        country_code: selectedCountry,
        region_name: selectedRegion,
      });

      setPlans(plansData.plans || []);
      setAdminMarkup(plansData.adminMarkup || null);
    };

    fetchPlansData();
  }, [selectedCountry, selectedRegion]);

  return (
    <Plans
      countries={countries.map((c) => ({ code: c._id, name: c.name }))}
      regions={regions.map((r) => ({ name: r.name }))}
      plans={plans}
      adminMarkup={adminMarkup}
      selectedCountry={selectedCountry}
      selectedRegion={selectedRegion}
      setSelectedCountry={setSelectedCountry}
      setSelectedRegion={setSelectedRegion}
      userProfile={userProfile}
    />
  );
}
