// app/support/page.tsx
import Support from "./Support";

export default async function Page() {
  const tickets = [
    {
      id: "#2056",
      priority: "Low",
      subject: "Unable to Activate",
      createdOn: "12 Mar 25",
      lastUpdate: "14 Mar 25",
      status: "Open",
      description: "User unable to activate SIM after purchase.",
    },
    {
      id: "#2050",
      priority: "Medium",
      subject: "Refund Request",
      createdOn: "11 Mar 25",
      lastUpdate: "13 Mar 25",
      status: "Pending",
      description: "Customer requested a refund due to duplicate order.",
    },
    {
      id: "#2040",
      priority: "Urgent",
      subject: "Billing Issue",
      createdOn: "10 Mar 25",
      lastUpdate: "12 Mar 25",
      status: "Resolved",
      description: "Incorrect billing applied to the user’s plan.",
    },
  ];

  return <Support tickets={tickets} />;
}
