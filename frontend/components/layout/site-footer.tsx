"use client";

import Link from "next/link";
import { useDictionary, useSiteLocale } from "@/components/layout/locale-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getNavigationItems } from "@/lib/site-content";
import { buildWhatsappLink } from "@/lib/utils";
import { SiteContent } from "@/types/site";
import { BrandLogo } from "./brand-logo";

interface SiteFooterProps {
  siteContent: SiteContent;
}

export function SiteFooter({ siteContent }: SiteFooterProps) {
  const locale = useSiteLocale();
  const t = useDictionary();
  const navigationItems = getNavigationItems(locale);
  const trustPoints =
    locale === "en"
      ? [
          "Mango-only premium catalog",
          "Cash on Delivery available",
          "Manual bKash or Nagad support if needed",
        ]
      : [
          "শুধু আম-কেন্দ্রিক প্রিমিয়াম ক্যাটালগ",
          "Cash on Delivery উপলব্ধ",
          "প্রয়োজনে manual bKash বা Nagad সহায়তা",
        ];

  return (
    <footer className="mt-20 border-t border-white/40 bg-[#f6ead2]">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-3 px-4 pt-8 sm:px-6 lg:px-10">
        {trustPoints.map((point) => (
          <div
            key={point}
            className="w-full rounded-[1.15rem] border border-[#d8caa9] bg-white/70 px-4 py-2 text-center text-sm font-semibold text-brand-deep sm:w-auto sm:rounded-full"
          >
            {point}
          </div>
        ))}
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.7fr_0.8fr_0.9fr] lg:gap-10 lg:px-10">
        <div className="space-y-5">
          <BrandLogo siteContent={siteContent} />
          <p className="max-w-md text-sm leading-7 text-muted">
            {siteContent.aboutSummary}
          </p>
          <p className="text-sm font-semibold text-brand-deep">
            {siteContent.footerNote}
          </p>
          <LanguageSwitcher />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-deep">{t.footer.explore}</h3>
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
          <h3 className="text-lg font-semibold text-brand-deep">{t.footer.contact}</h3>
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
              {t.common.whatsapp}
            </a>
            <a
              href={siteContent.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
            >
              {t.common.facebook}
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-deep">
            {locale === "en" ? "Order Support" : "অর্ডার সহায়তা"}
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <p>
              {locale === "en"
                ? "Checkout stays simple with manual confirmation and no online gateway."
                : "কোনো online gateway ছাড়া manual confirmation-এর মাধ্যমেই checkout সহজ রাখা হয়েছে।"}
            </p>
            <p>
              {locale === "en"
                ? "Choose your mango pack size, submit the order, and our team will confirm the next step."
                : "পছন্দের আমের প্যাক সাইজ বেছে অর্ডার দিন, এরপর আমাদের টিম পরের ধাপ জানিয়ে দেবে।"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
