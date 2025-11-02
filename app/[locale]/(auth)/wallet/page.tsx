import Wallet from "./Wallet";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
