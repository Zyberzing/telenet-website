import OTPVerification from "./OTPVerification";
import { getPageMetadata } from "@/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata(locale, "otp");
}

export default async function Page({
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <OTPVerification prefilledEmail={email} />;
}
