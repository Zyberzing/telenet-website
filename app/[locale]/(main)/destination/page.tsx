import { getCountries } from "@/services/plansApi";
import { getPageMetadata } from "@/services/seo";
import Destination from "./Destination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "destination");
}

export default async function Page() {
  const countries = await getCountries();
  return (
    <main>
      {/* You can wrap with layout/styling */}
      <Destination countries={countries} />
    </main>
  );
}
