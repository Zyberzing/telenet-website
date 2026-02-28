import { StoreProvider } from "@/store/providers/StoreProvider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import GoogleProvider from "./providers/GoogleProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Telenet",
  description: "Global eSIM for travellers",
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
          <GoogleProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </GoogleProvider>
          <Toaster richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
