import { getCountries } from "@/services/plansApi";
import Destination from "./Destination";

export default async function Page() {
  const countries = await getCountries();
  return (
    <main>
      {/* You can wrap with layout/styling */}
      <Destination countries={countries} />
    </main>
  );
}
