import Dashboard from "./Dashboard";

export default async function Page() {
  // const token = await getAccessToken();
  // console.log("Access Token:", token);
  const suggestedPlans = [
    { price: 10, validity: "15 days", data: "3 GB" },
    { price: 30, validity: "60 days", data: "10 GB" },
    { price: 18, validity: "30 days", data: "8 GB" },
  ];

  const userData = {
    name: "Alex",
    activePlans: 2,
    walletBalance: 50,
    lastTransaction: {
      amount: 15,
      date: "22 Oct 2025",
      validity: "30-day plan",
      data: "USA 5GB",
    },
  };

  return <Dashboard suggestedPlans={suggestedPlans} userData={userData} />;
}
