import { hasSession } from "@/lib/session";
import { Plan } from "@/lib/types";
import { getWishlist } from "@/services/wishlist";
import Favorites from "./Favorites";

export default async function FavoritesPage() {
  const session = await hasSession();
  const isLoggedIn = Boolean(session?.accessToken);

  let initialPlans: Plan[] = [];
  if (isLoggedIn) {
    try {
      initialPlans = await getWishlist({ page: 1, limit: 50 });
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  }

  return <Favorites initialPlans={initialPlans} isLoggedIn={isLoggedIn} />;
}
