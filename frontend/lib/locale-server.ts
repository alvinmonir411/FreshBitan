import { cookies } from "next/headers";
import { defaultLocale, isSiteLocale, SiteLocale, LOCALE_COOKIE_NAME } from "@/lib/locale-data";

export const getSiteLocale = async (): Promise<SiteLocale> => {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return isSiteLocale(locale) ? locale : defaultLocale;
};
