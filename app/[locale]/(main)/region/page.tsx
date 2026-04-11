import { getRegions } from "@/services/plansApi";
import { getPageMetadata } from "@/services/seo";
import Region from "./Region";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "region");
}

export default async function Page() {
  const regions = await getRegions();
  return (
    <main>
      <Region regions={regions} />
    </main>
  );
}
