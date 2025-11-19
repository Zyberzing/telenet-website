import { getRegions } from "@/services/plansApi";
import Region from "./Region";

export default async function Page() {
  const regions = await getRegions();
  return (
    <main>
      <Region regions={regions} />
    </main>
  );
}
