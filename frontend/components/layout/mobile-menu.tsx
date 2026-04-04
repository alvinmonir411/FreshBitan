"use client";

import Link from "next/link";
import { useState } from "react";
import { CartLink } from "@/components/cart/cart-link";
import { buttonVariants } from "@/components/ui/button";
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

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/80 text-brand-deep"
        aria-label="Toggle menu"
      >
        {isOpen ? "×" : "≡"}
      </button>

      <div
        className={cn(
          "absolute inset-x-0 top-full z-40 mt-4 rounded-[2rem] border border-border bg-[#fffaf1]/96 p-5 shadow-[0_30px_80px_rgba(28,36,27,0.18)] backdrop-blur",
          !isOpen && "hidden",
        )}
      >
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
            আজই অর্ডার করুন
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
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
