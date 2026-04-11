import { Order } from "@/lib/types";
import { getOrderList } from "@/services/order";
import { getPageMetadata } from "@/services/seo";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "order-billing");
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
