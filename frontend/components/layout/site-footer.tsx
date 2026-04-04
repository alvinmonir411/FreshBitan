import Link from "next/link";
import { navigationItems } from "@/lib/site-content";
import { buildWhatsappLink } from "@/lib/utils";
import { SiteContent } from "@/types/site";
import { BrandLogo } from "./brand-logo";

interface SiteFooterProps {
  siteContent: SiteContent;
}

export function SiteFooter({ siteContent }: SiteFooterProps) {
  return (
    <footer className="mt-20 border-t border-white/40 bg-[#f6ead2]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-10">
        <div className="space-y-5">
          <BrandLogo siteContent={siteContent} />
          <p className="max-w-md text-sm leading-7 text-muted">
            {siteContent.aboutSummary}
          </p>
          <p className="text-sm font-semibold text-brand-deep">
            {siteContent.footerNote}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-deep">Explore</h3>
          <div className="mt-4 flex flex-col gap-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground hover:text-brand-deep"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-deep">Contact</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <p>{siteContent.phone}</p>
            <p>{siteContent.email}</p>
            <p>{siteContent.address}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={buildWhatsappLink(
                siteContent.whatsappNumber,
                siteContent.whatsappMessage,
              )}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#22c55e] px-4 py-2 text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
            <a
              href={siteContent.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
