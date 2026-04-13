import { getPageMetadata } from "@/services/seo";
import { getMyEsimList } from "@/services/esim";
import MyEsim from "./MyEsim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "my-esim");
}

export default async function MyEsimPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page ?? "1") || 1);
  const limit = 10;
  const response = await getMyEsimList(page, limit);

  return (
    <MyEsim
      initialList={response?.result || []}
      initialPagination={response?.pagination || null}
      limit={limit}
      initialPage={page}
    />
  );
}
