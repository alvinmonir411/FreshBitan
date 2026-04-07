"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useDictionary } from "@/components/layout/locale-provider";
import { SiteContent } from "@/types/site";

interface BrandLogoProps {
  siteContent: SiteContent;
}

export function BrandLogo({ siteContent }: BrandLogoProps) {
  const hasLogo = Boolean(siteContent.logoUrl.trim());
  const t = useDictionary();

  return (
    <Link href="/" className="inline-flex min-w-0 items-center gap-3">
      {hasLogo ? (
        <img
          src={siteContent.logoUrl}
          alt={`${siteContent.brandName} logo`}
          className="h-11 w-11 rounded-2xl object-cover shadow-[0_12px_26px_rgba(239,139,30,0.24)]"
        />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top_left,#fff2d3,#ef8b1e)] shadow-[0_12px_26px_rgba(239,139,30,0.24)]">
          <span className="text-lg font-black text-brand-deep">F</span>
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-display text-2xl leading-none text-brand-deep">
          {siteContent.brandName}
        </span>
        <span className="hidden truncate text-[11px] tracking-[0.14em] text-accent xl:block">
          {t.nav.tagline}
        </span>
      </span>
    </Link>
  );
}
