import { getPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "partner-with-us");
}

export default function PartnerWithUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
