"use client"; // ✅ Make it a client component

import { useGetProfileQuery } from "@/services/authApi";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileSetting from "./ProfileSetting";

export default function Page() {
  const locale = useLocale();
  const router = useRouter();

  const { data: user, isLoading, error } = useGetProfileQuery(undefined);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/`);
    }
  }, [isLoading, user, router, locale]);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong loading your profile.</p>;

  return <ProfileSetting user={user} />;
}
