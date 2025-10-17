"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { use } from "react";

export default function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
