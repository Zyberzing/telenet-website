import VirtualNumberPage from "./VirtualNumberPage";
import { getPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "virtual-number");
}

export default async function Page() {
  // Simulate fetching user data (SSR)
  // const res = await fetch("https://api.example.com/user", { cache: "no-store" });
  // const user = await res.json();

  const virtualNumbers = [
    { id: 1, number: "4455 14612", duplicate: "4455 14612" },
    { id: 2, number: "5566 6542", duplicate: "5566 6542" },
    { id: 3, number: "3355 1546", duplicate: "3355 1546" },
    { id: 4, number: "6420 5420", duplicate: "6420 5420" },
    { id: 5, number: "6584 0215", duplicate: "6584 0215" },
  ];

  return <VirtualNumberPage virtualNumbers={virtualNumbers} />;
}
