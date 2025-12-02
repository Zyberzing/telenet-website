import { getOrderList } from "@/services/order";
import OrderBilling, { Order } from "./OrderBilling";

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
  const res = (await getOrderList()) as GetOrderListResponse | null;
  const orders: Order[] = res?.result || [];

  return <OrderBilling orders={orders} />;
}
