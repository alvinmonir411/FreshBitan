"use client";

import { usePathname } from "next/navigation";
import { FloatingContactButtons } from "@/components/layout/floating-contact-buttons";
import { LocaleProvider } from "@/components/layout/locale-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteLocale } from "@/lib/locale-data";
import { SiteContent } from "@/types/site";

interface AppShellProps {
  children: React.ReactNode;
  siteContent: SiteContent;
  locale: SiteLocale;
}

export function AppShell({ children, siteContent, locale }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <LocaleProvider locale={locale}><div className="relative flex min-h-screen flex-col">{children}</div></LocaleProvider>;
  }

  return (
    <LocaleProvider locale={locale}>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader siteContent={siteContent} />
        <div className="flex-1">{children}</div>
        <SiteFooter siteContent={siteContent} />
        <FloatingContactButtons siteContent={siteContent} />
      </div>
    </LocaleProvider>
  );
}
