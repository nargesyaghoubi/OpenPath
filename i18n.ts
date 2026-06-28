// Loads the correct translation messages based on the current locale
import { getRequestConfig } from "next-intl/server";
import { routing } from "./lib/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

// Fall back to default locale if invalid or missing
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Dynamically import translation messages for the current locale
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
