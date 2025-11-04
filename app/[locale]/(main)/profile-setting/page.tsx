"use client";

import { useGetProfileQuery } from "@/services/authApi";
import { RootState } from "@/store/Store";
import { useSelector } from "react-redux";
import ProfileSetting from "./ProfileSetting";

export default function Page() {
  const token = useSelector((state: RootState) => state?.auth?.token);

  const { data, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  if (!token) {
    return <p>Please log in to view your profile.</p>;
  }

  if (isLoading) return <p>Loading...</p>;

  return <ProfileSetting user={data?.data} />;
}
