"use client";

import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { useDictionary, useSiteLocale } from "@/components/layout/locale-provider";
import { getNavigationItems } from "@/lib/site-content";
import { buildWhatsappLink } from "@/lib/utils";
import { SiteContent } from "@/types/site";
import { BrandLogo } from "./brand-logo";
import { MobileMenu } from "./mobile-menu";

interface SiteHeaderProps {
  siteContent: SiteContent;
}

export function SiteHeader({ siteContent }: SiteHeaderProps) {
  const locale = useSiteLocale();
  const t = useDictionary();
  const navigationItems = getNavigationItems(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[#fff7ec]/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-4 sm:px-8 lg:px-10">
        <BrandLogo siteContent={siteContent} />

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-white/70 p-2 xl:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-[#fff4df]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <LanguageSwitcher />
          <CartLink />
          <a
            href={siteContent.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className={`${buttonVariants({ variant: "outline", size: "md" })} whitespace-nowrap px-4 text-sm`}
          >
            Facebook
          </a>
          <a
            href={buildWhatsappLink(
              siteContent.whatsappNumber,
              siteContent.whatsappMessage,
            )}
            target="_blank"
            rel="noreferrer"
            className={`${buttonVariants({ variant: "primary", size: "md" })} whitespace-nowrap px-4 text-sm`}
          >
            {t.common.orderNow}
          </a>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <CartLink compact />
          <div className="relative">
            <MobileMenu
              navigationItems={navigationItems}
              siteContent={siteContent}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
