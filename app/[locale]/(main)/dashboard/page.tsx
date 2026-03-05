import { getProfile } from "@/services/auth";
import { getOrderDashboardSummary } from "@/services/order";
import { User } from "../profile-setting/ProfileSetting";
import Dashboard from "./Dashboard";

export default async function Page() {
  const suggestedPlans = [
    { price: 10, validity: "15 days", data: "3 GB" },
    { price: 30, validity: "60 days", data: "10 GB" },
    { price: 18, validity: "30 days", data: "8 GB" },
  ];

  let user: User | null = null;
  let summary: Awaited<ReturnType<typeof getOrderDashboardSummary>> = null;

  try {
    const [profileRes, summaryRes] = await Promise.all([
      getProfile(),
      getOrderDashboardSummary(),
    ]);
    user = profileRes;
    summary = summaryRes;
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
  }

  const transactionDateRaw = summary?.lastTransaction?.date;
  const transactionDate = transactionDateRaw
    ? new Date(transactionDateRaw).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "N/A";

  const validityDays = summary?.lastTransaction?.validity;
  const validityLabel =
    typeof validityDays === "number"
      ? `${validityDays} ${validityDays === 1 ? "day" : "days"}`
      : "N/A";

  const userData = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    id: user?._id ?? "",
    phone: user?.phone ?? "",
    country: user?.countryCode ?? "",
    location: user?.location ?? "",
    activePlans: summary?.activePlans ?? 0,
    walletBalance: summary?.walletBalance ?? 0,
    lastTransaction: {
      amount: summary?.lastTransaction?.amount ?? 0,
      date: transactionDate,
      validity: validityLabel,
      data: summary?.lastTransaction?.data || "N/A",
    },
  };

  return <Dashboard suggestedPlans={suggestedPlans} userData={userData} />;
}
