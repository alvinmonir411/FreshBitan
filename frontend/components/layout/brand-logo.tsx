/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SiteContent } from "@/types/site";

interface BrandLogoProps {
  siteContent: SiteContent;
}

export function BrandLogo({ siteContent }: BrandLogoProps) {
  const hasLogo = Boolean(siteContent.logoUrl.trim());

  return (
    <Link href="/" className="inline-flex items-center gap-3">
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
      <span className="flex flex-col">
        <span className="font-display text-2xl leading-none text-brand-deep">
          {siteContent.brandName}
        </span>
        <span className="text-xs uppercase tracking-[0.22em] text-accent">
          Seasonal Fruit
        </span>
      </span>
    </Link>
  );
}
