import { cache } from "react";
import { routing } from "./routing";

export type IntlMessages = Record<string, unknown>;

type GetLanguageResponse = {
  status?: string;
  message?: string;
  data?: IntlMessages;
};

const I18N_PLATFORM = "web_app";

async function fetchMessagesForLocale(
  locale: string,
): Promise<IntlMessages | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

  if (!baseUrl) {
    console.error("[i18n] NEXT_PUBLIC_API_BASE is not configured.");
    return null;
  }

  try {
    const response = await fetch(
      `${baseUrl}/i18n/getlang?platform=${I18N_PLATFORM}&code=${encodeURIComponent(locale)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const payload =
      (await response.json().catch(() => null)) as GetLanguageResponse | null;

    if (!response.ok || payload?.status !== "success" || !payload?.data) {
      throw new Error(payload?.message || "Failed to fetch language file");
    }

    return payload.data;
  } catch (error) {
    console.error(`[i18n] Failed to fetch messages for locale "${locale}":`, error);
    return null;
  }
}

export const getI18nMessages = cache(
  async (locale: string): Promise<IntlMessages> => {
    const normalizedLocale =
      locale?.trim().toLowerCase() || routing.defaultLocale;

    const primaryMessages = await fetchMessagesForLocale(normalizedLocale);
    if (primaryMessages) {
      return primaryMessages;
    }

    if (normalizedLocale !== routing.defaultLocale) {
      const fallbackMessages = await fetchMessagesForLocale(routing.defaultLocale);
      if (fallbackMessages) {
        return fallbackMessages;
      }
    }

    return {};
  },
);
