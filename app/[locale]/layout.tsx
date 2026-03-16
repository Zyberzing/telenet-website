import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getI18nMessages } from "@/i18n/getMessages";
import { isLocaleSegment } from "@/i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocaleSegment(locale)) {
    notFound();
  }

  const messages = await getI18nMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
