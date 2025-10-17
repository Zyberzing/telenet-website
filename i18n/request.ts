import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || "en"; // fallback

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;

    if (!messages) throw new Error("No messages loaded");
    return { locale, messages };
  } catch (error) {
    console.error(`❌ Missing messages for locale: ${locale}`, error);
    throw new Error(`No messages found for locale: ${locale}`);
  }
});
