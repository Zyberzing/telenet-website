import { getProfile } from "@/services/auth";
import { getPageMetadata } from "@/services/seo";
import ProfileSetting, { User } from "./ProfileSetting"; // adjust path

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "profile-setting");
}

export default async function Page() {
  let user: User | null = null;

  try {
    const profile = await getProfile();
    user = profile;
  } catch (err) {
    console.error("Failed to fetch profile:", err);
  }

  return <ProfileSetting user={user!} />;
}
