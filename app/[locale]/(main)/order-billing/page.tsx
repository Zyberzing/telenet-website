import { Order } from "@/lib/types";
import { getOrderList } from "@/services/order";
import OrderBilling from "./OrderBilling";

export interface GetOrderListResponse {
  // status: string;
  // message: string;
  // data: {
  result: Order[];
  pagination: Record<string, unknown>;
  // };
  // statusCode: number;
}

export default async function OrderBillingPage() {
  const page = 1;
  const limit = 10;

  const res = await getOrderList(page, limit);

  return (
    <OrderBilling
      initialOrders={res?.result || []}
      initialPagination={res?.pagination}
      limit={limit}
    />
  );
}
