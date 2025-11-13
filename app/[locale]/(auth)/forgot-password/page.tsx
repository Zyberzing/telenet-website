import ForgotPassword from "./ForgotPassword";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const resolvedParams = await searchParams;
  const email = resolvedParams?.email ?? "";

  return <ForgotPassword prefilledEmail={email} />;
}
