import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";
import { getI18nMessages } from "./getMessages";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = ((await requestLocale) || routing.defaultLocale).toLowerCase();
  const messages = await getI18nMessages(locale);

  return { locale, messages };
});
