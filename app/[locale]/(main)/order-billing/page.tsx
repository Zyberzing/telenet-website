import OrderBilling from "./OrderBilling";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getOrders() {
  const orders = [
    {
      id: "#10234",
      plan: "USA 5GB/30d",
      provider: "Verizon",
      payment: "Visa",
      status: "processing",
    },
    {
      id: "#10212",
      plan: "UK 10GB/15d",
      provider: "Vodafone",
      payment: "Wallet",
      status: "cancelled",
    },
    {
      id: "#10198",
      plan: "Japan 3GB/7d",
      provider: "NTT Docomo",
      payment: "Card",
      status: "inReview",
    },
    {
      id: "#10177",
      plan: "AUS 5GB/30d",
      provider: "Telstra",
      payment: "Visa",
      status: "refunded",
    },
    {
      id: "#10176",
      plan: "AUS 5GB/30d",
      provider: "Telstra",
      payment: "Visa",
      status: "active",
    },
    {
      id: "#10175",
      plan: "AUS 5GB/30d",
      provider: "Telstra",
      payment: "Visa",
      status: "expired",
    },
  ];

  return orders;
}

export default async function OrderBillingPage() {
  const orders = await getOrders();

  return <OrderBilling orders={orders} />;
}
