// Supported locales and routing configuration for next-intl

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa", "ar", "fr", "es", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});
