import { getPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "cancle");
}

export default function CancelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
