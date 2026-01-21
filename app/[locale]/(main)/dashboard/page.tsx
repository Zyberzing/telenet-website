import { getProfile } from "@/services/auth";
import { User } from "../profile-setting/ProfileSetting";
import Dashboard from "./Dashboard";

export default async function Page() {
  const suggestedPlans = [
    { price: 10, validity: "15 days", data: "3 GB" },
    { price: 30, validity: "60 days", data: "10 GB" },
    { price: 18, validity: "30 days", data: "8 GB" },
  ];

  let user: User | null = null;

  try {
    user = await getProfile();
  } catch (err) {
    console.error("Failed to fetch profile:", err);
  }

  const userData = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    id: user?._id ?? "",
    phone: user?.phone ?? "",
    country: user?.countryCode ?? "",
    location: user?.location ?? "",
    activePlans: 0,
    walletBalance: 0,
    lastTransaction: {
      amount: 0,
      date: "N/A",
      validity: "N/A",
      data: "N/A",
    },
  };

  return <Dashboard suggestedPlans={suggestedPlans} userData={userData} />;
}
