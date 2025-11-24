import { getMyPlans } from "@/services/order";
import MyPlans from "./MyPlansClient";
import { Plan } from "./MyPlansClient";

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

  const myPlans: Plan[] = response?.result || [];
  return <MyPlans plans={myPlans} />;
};

export default Page;
