import type { Metadata } from "next";
import { use } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telenet",
  description: "Global eSIM for Lifetime",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
