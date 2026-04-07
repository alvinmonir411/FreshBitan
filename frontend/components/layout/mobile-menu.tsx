"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartLink } from "@/components/cart/cart-link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { useDictionary } from "@/components/layout/locale-provider";
import { buildWhatsappLink, cn } from "@/lib/utils";
import { NavigationItem, SiteContent } from "@/types/site";

interface MobileMenuProps {
  navigationItems: NavigationItem[];
  siteContent: SiteContent;
}

export function MobileMenu({
  navigationItems,
  siteContent,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useDictionary();

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/80 text-brand-deep"
        aria-label={t.nav.toggleMenu}
      >
        {isOpen ? "×" : "≡"}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#1c241b]/20 px-4 pb-6 pt-24 backdrop-blur-sm sm:px-6",
          !isOpen && "hidden",
        )}
        onClick={() => setIsOpen(false)}
      >
        <div
          className="mx-auto w-full max-w-md rounded-[2rem] border border-border bg-[#fffaf1]/96 p-5 shadow-[0_30px_80px_rgba(28,36,27,0.18)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          <nav className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-foreground hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 grid gap-3">
            <CartLink
              compact
              onClick={() => setIsOpen(false)}
              className="w-full justify-center"
            />
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className={buttonVariants({
                variant: "primary",
                size: "md",
                fullWidth: true,
              })}
            >
              {t.common.orderNow}
            </Link>
            <a
              href={buildWhatsappLink(
                siteContent.whatsappNumber,
                siteContent.whatsappMessage,
              )}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({
                variant: "whatsapp",
                size: "md",
                fullWidth: true,
              })}
            >
              {t.common.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
