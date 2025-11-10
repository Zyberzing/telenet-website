import OTPVerification from "./OTPVerification";

export default async function Page({
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <OTPVerification prefilledEmail={email} />;
}
