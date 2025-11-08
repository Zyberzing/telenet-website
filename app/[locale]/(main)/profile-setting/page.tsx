import { getProfile } from "@/services/authApi";
import ProfileSetting, { User } from "./ProfileSetting"; // adjust path

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
