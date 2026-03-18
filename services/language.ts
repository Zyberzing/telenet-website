export type LanguageOption = {
  id: string;
  code: string;
  name: string;
};

type LanguageListApiResponse = {
  message?: string;
  data?: {
    result?: Array<{
      _id?: string;
      id?: string;
      code?: string;
      lang?: string;
    }>;
  };
};

export const FALLBACK_LANGUAGES: LanguageOption[] = [
  { id: "en", code: "en", name: "English" },
  { id: "fr", code: "fr", name: "Français" },
  { id: "es", code: "es", name: "Español" },
];

export async function getLanguageList(): Promise<LanguageOption[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

  if (!baseUrl) {
    return FALLBACK_LANGUAGES;
  }

  try {
    const response = await fetch(`${baseUrl}/lang/list`, {
      method: "GET",
      cache: "no-store",
    });

    const payload = (await response
      .json()
      .catch(() => null)) as LanguageListApiResponse | null;

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to fetch language list");
    }

    const languages =
      payload?.data?.result
        ?.filter(
          (
            item,
          ): item is {
            _id: any;
            code: string;
            lang: string;
          } => Boolean(item?.code && item?.lang),
        )
        .map((item) => {
          const code = item.code.toLowerCase();
          const id = item._id || code;

          return {
            id,
            code,
            name: item.lang,
          };
        }) || [];

    return languages.length > 0 ? languages : FALLBACK_LANGUAGES;
  } catch (error) {
    console.error("Failed to fetch language list:", error);
    return FALLBACK_LANGUAGES;
  }
}

export async function getLanguageIdByCode(
  code: string,
): Promise<string | undefined> {
  const languages = await getLanguageList();
  return languages.find((item) => item.code === code.toLowerCase())?.id;
}
