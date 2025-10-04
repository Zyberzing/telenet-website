import type { Metadata } from "next";
import Footer from "./Footer";
import Header from "./Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telenet",
  description: "Global eSIM for Lifetime",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
