import TopUp from "./TopUp";
import { getPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "top-up");
}

export default async function Page() {
  // ✅ Optionally, fetch any JSON or API data (server-side)
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/guide.json`, {
  //   cache: "no-store", // ensures SSR every request
  // });
  // const guideData = await res.json();

  // ✅ Pass translations or other data to the client component
  return <TopUp />;
}
