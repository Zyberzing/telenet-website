export const routing = {
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
};

export function isLocaleSegment(value: string | undefined): boolean {
  return Boolean(value && /^[a-z]{2,5}$/i.test(value));
}
