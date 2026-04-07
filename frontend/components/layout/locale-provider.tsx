"use client";

import { createContext, useContext } from "react";
import { SiteLocale, getDictionary } from "@/lib/locale-data";

const LocaleContext = createContext<SiteLocale>("bn");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: SiteLocale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useSiteLocale = () => useContext(LocaleContext);

export const useDictionary = () => {
  const locale = useSiteLocale();
  return getDictionary(locale);
};
