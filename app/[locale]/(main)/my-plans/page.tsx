import type { Plan } from "./MyPlansClient";
import MyPlans from "./MyPlansClient";

export default async function Page() {
  const plans: Plan[] = [
    {
      id: "1",
      country: "USA",
      provider: "Verizon 4G/5G/VoLTE",
      flag: "/flags/usa.svg",
      dataLeft: "4.2 GB",
      totalData: "5 GB",
      validUntil: "22 Oct 2025",
      price: "$15",
      status: "active",
    },
    {
      id: "2",
      country: "UK",
      provider: "Telefone 5G/VoLTE",
      flag: "/flags/uk.svg",
      dataLeft: "4.2 GB",
      totalData: "5 GB",
      validUntil: "22 Oct 2025",
      price: "$15",
      status: "active",
    },
    {
      id: "3",
      country: "Japan",
      provider: "NTT DocNet",
      flag: "/flags/uk.svg",
      expiredOn: "10 Sep 2025",
      lastPlan: "5 GB • 30 Days",
      price: "$15",
      totalData: "",
      status: "expired",
    },
    {
      id: "4",
      country: "Australia",
      provider: "Telstra",
      flag: "/flags/uk.svg",
      expiredOn: "03 Sep 2025",
      lastPlan: "5 GB • 30 Days",
      price: "$15",
      totalData: "",
      status: "expired",
    },
  ];

  return <MyPlans plans={plans} />;
}
