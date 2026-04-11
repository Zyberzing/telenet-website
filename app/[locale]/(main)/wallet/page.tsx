import Wallet from "./Wallet";
import { getPageMetadata } from "@/services/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "wallet");
}

async function getTransactions() {
  return [
    {
      date: "12 Sep 25",
      amount: 20,
      method: "Google Pay",
      status: "Completed",
    },
    {
      date: "05 Sep 25",
      amount: 15,
      method: "Credit Card",
      status: "Completed",
    },
    { date: "22 Aug 25", amount: 10, method: "Wallet Auto", status: "Pending" },
    { date: "15 Aug 25", amount: 30, method: "Apple Pay", status: "Completed" },
  ];
}

export default async function WalletPage() {
  const transactions = await getTransactions();

  return <Wallet transactions={transactions} />;
}
