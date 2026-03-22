import { getMyPlans } from "@/services/order";
import MyPlans, { Plan } from "./MyPlansClient";

interface GetMyPlansResponse {
  // status: string;
  // message: string;
  // data: {
  result: Plan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    status?: string;
  };
  // };
  // statusCode: number;
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) => {
  const params = await searchParams;
  const { page = "1", limit = "10" } = params;

  const response = (await getMyPlans({
    page,
    limit,
  })) as GetMyPlansResponse | null;
  const expiredResponse = (await getMyPlans({
    page,
    limit,
    status: "expired",
  } as any)) as GetMyPlansResponse | null;
  const cancelledResponse = (await getMyPlans({
    page,
    limit,
    status: "cancelled",
  } as any)) as GetMyPlansResponse | null;

  const myPlans: Plan[] = response?.result || [];
  const expiredPlans: Plan[] = expiredResponse?.result || [];
  const cancelledPlans: Plan[] = cancelledResponse?.result || [];

  return (
    <MyPlans
      plans={myPlans}
      expiredPlan={expiredPlans}
      cancelledPlan={cancelledPlans}
    />
  );
};

export default Page;
