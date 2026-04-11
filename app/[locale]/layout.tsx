import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import HtmlLanguageSync from "@/components/layout/HtmlLanguageSync";
import { getI18nMessages } from "@/i18n/getMessages";
import { isLocaleSegment } from "@/i18n/routing";
import { getLanguageDirByCode } from "@/services/language";

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
  const dir = await getLanguageDirByCode(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLanguageSync lang={locale} dir={dir} />
      {children}
    </NextIntlClientProvider>
  );
}
