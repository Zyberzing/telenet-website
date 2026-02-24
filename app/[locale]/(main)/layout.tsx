// "use client";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/header/Header";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
