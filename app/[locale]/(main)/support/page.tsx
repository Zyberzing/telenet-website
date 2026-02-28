import { getTickets } from "@/services/ticket";
import Support from "./Support";

export default async function Page() {
  const tickets = await getTickets({
    page: 1,
    limit: 20,
  });

  return <Support initialTickets={tickets} />;
}
