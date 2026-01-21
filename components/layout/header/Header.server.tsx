import { User } from "@/app/[locale]/(main)/profile-setting/ProfileSetting";
import { getProfile } from "@/services/auth";
import Header from "./Header.client";

export default async function Page() {
  let user: User | null = null;
  //   const currencyCode = (await getCurrencyCookie()) || "USD";

  //   let currencyRate = 1;
  //   try {
  //     const currencies = await getCurrency();
  //     const found = currencies.find(c => c.currency === currencyCode);
  //     if (found && found.rate) {
  //       currencyRate = found.rate;
  //     }
  //   } catch (e) {
  //     console.error("Failed to fetch currency rate", e);
  //   }

  try {
    user = await getProfile();
    console.log("fetched profile in header page.tsx", user);
  } catch (err) {
    console.error("Failed to fetch profile:", err);
  }
  console.log("user in header page.tsx", user);
  const userData = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    id: user?._id ?? "",
    profilePicture: user?.profilePicture ?? "",
    phone: user?.phone ?? "",
    country: user?.countryCode ?? "",
    location: user?.location ?? "",
  };

  return <Header {...userData} />;
}
