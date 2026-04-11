import { getPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "kyc");
}

export default function KycLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
