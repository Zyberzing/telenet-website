import Footer from "@/components/layout/Footer";
import HeaderAuth from "@/components/layout/HeaderAuth";
import { use } from "react";

export default function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAuth />
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
