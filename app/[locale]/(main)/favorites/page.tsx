import { hasSession } from "@/lib/session";
import { Pagination, Plan } from "@/lib/types";
import { getWishlist } from "@/services/wishlist";
import Favorites from "./Favorites";

const FAVORITES_LIMIT = 9;

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const session = await hasSession();
  const isLoggedIn = Boolean(session?.accessToken);
  const currentPage = Math.max(1, Number(query.page ?? "1") || 1);

  let initialPlans: Plan[] = [];
  let pagination: Pagination | null = null;
  if (isLoggedIn) {
    try {
      const response = await getWishlist({
        page: currentPage,
        limit: FAVORITES_LIMIT,
      });
      initialPlans = response.plans;
      pagination = response.pagination;
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  }

  return (
    <Favorites
      initialPlans={initialPlans}
      isLoggedIn={isLoggedIn}
      currentPage={currentPage}
      pagination={pagination}
    />
  );
}
