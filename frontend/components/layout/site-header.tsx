import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { buttonVariants } from "@/components/ui/button";
import { navigationItems } from "@/lib/site-content";
import { buildWhatsappLink } from "@/lib/utils";
import { SiteContent } from "@/types/site";
import { BrandLogo } from "./brand-logo";
import { MobileMenu } from "./mobile-menu";

interface SiteHeaderProps {
  siteContent: SiteContent;
}

export function SiteHeader({ siteContent }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[#fff7ec]/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
        <BrandLogo siteContent={siteContent} />

        <nav className="hidden items-center gap-2 rounded-full border border-border bg-white/70 p-2 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-[#fff4df]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CartLink />
          <a
            href={siteContent.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "md" })}
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
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            আজই অর্ডার করুন
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
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
