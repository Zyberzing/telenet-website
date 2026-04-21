import { User } from "@/app/[locale]/(main)/profile-setting/ProfileSetting";
import { getPageMetadata } from "@/services/seo";
import { getProfile } from "@/services/auth";
import { getRenewalList } from "@/services/order";
import RenewPlans from "./RenewPlans";

type SearchParams = {
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
  page?: string;
  limit?: string;
  sourceOrderId?: string;
  packageId?: string;
  packageName?: string;
  data?: string;
  validity?: string;
  call?: string;
  sms?: string;
  finalPrice?: string;
  basePrice?: string;
  taxAmount?: string;
  stripe?: string;
  markupAmount?: string;
  fupPolicy?: string;
  country?: string;
  provider?: string;
  network?: string;
  coverage?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "renew");
}

export default async function RenewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;

  const initialPage = Math.max(1, Number(query.page ?? 1) || 1);
  const initialLimit = Math.max(1, Number(query.limit ?? 9) || 9);
  const initialSearch = query.search || query.sourceOrderId || "";

  const [renewalData, userProfile] = await Promise.all([
    getRenewalList(initialPage, initialLimit, {
      startDate: query.startDate,
      endDate: query.endDate,
      search: initialSearch,
      status: query.status,
    }),
    getProfile(),
  ]);

  const prefilledPlan =
    query.sourceOrderId || query.packageId || query.packageName
      ? {
          sourceOrderId: query.sourceOrderId || "",
          packageId: query.packageId || "",
          packageName: query.packageName || "",
          package_data: query.data || "",
          perioddays: query.validity || "",
          package_call: query.call || "",
          package_sms: query.sms || "",
          finalPrice: query.finalPrice || "",
          basePrice: query.basePrice || "",
          taxAmount: query.taxAmount || "",
          stripe: query.stripe || "",
          markupAmount: query.markupAmount || "",
          fup_policy: query.fupPolicy || "",
          country: query.country || "",
          provider: query.provider || "",
          network: query.network || "",
          coverage: query.coverage || "",
        }
      : null;

  return (
    <RenewPlans
      initialPlans={renewalData?.result || []}
      initialPagination={renewalData?.pagination || null}
      initialPage={initialPage}
      initialLimit={initialLimit}
      initialFilters={{
        startDate: query.startDate || "",
        endDate: query.endDate || "",
        search: initialSearch,
        status: query.status || "",
      }}
      sourceOrderId={query.sourceOrderId || ""}
      prefilledPlan={prefilledPlan}
      userProfile={userProfile as User | null}
    />
  );
}
