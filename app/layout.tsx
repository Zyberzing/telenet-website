import { StoreProvider } from "@/store/providers/StoreProvider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { isLocaleSegment, routing } from "@/i18n/routing";
import { getLanguageDirByCode } from "@/services/language";
import "./globals.css";
import GoogleProvider from "./providers/GoogleProvider";
import { CurrencyProvider } from "./providers/CurrencyProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Telenet",
  description: "Global eSIM for travellers",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") || "";
  const localeSegment = pathname.split("/").filter(Boolean)[0];
  const locale = isLocaleSegment(localeSegment)
    ? localeSegment
    : routing.defaultLocale;
  const dir = await getLanguageDirByCode(locale as string);

  return (
    <html lang={locale} dir={dir} className={outfit.variable}>
      <body dir={dir} className="antialiased">
        <StoreProvider>
          <GoogleProvider>
            <ThemeProvider>
              <CurrencyProvider>{children}</CurrencyProvider>
            </ThemeProvider>
          </GoogleProvider>
          <Toaster richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
