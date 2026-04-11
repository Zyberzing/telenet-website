import ForgotPassword from "./ForgotPassword";
import { getPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "forgot-password");
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const resolvedParams = await searchParams;
  const email = resolvedParams?.email ?? "";

  return <ForgotPassword prefilledEmail={email} />;
}
