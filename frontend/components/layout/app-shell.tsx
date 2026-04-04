"use client";

import { usePathname } from "next/navigation";
import { FloatingContactButtons } from "@/components/layout/floating-contact-buttons";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteContent } from "@/types/site";

interface AppShellProps {
  children: React.ReactNode;
  siteContent: SiteContent;
}

export function AppShell({ children, siteContent }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <div className="relative flex min-h-screen flex-col">{children}</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader siteContent={siteContent} />
      <div className="flex-1">{children}</div>
      <SiteFooter siteContent={siteContent} />
      <FloatingContactButtons siteContent={siteContent} />
    </div>
  );
}
