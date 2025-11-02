import { StoreProvider } from "@/store/providers/StoreProvider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Telenet",
  description: "Global eSIM for travelers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">
        <StoreProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
