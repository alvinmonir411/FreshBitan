"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useDictionary } from "@/components/layout/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { ProductSummary } from "@/types/api";
import {
  cn,
  formatCurrency,
  getActiveProductOptions,
  getCompactOptionLabel,
  getCompareAtPrice,
  getDefaultProductOption,
  getDisplayPrice,
  getPrimaryProductImage,
} from "@/lib/utils";

interface ProductCardProps {
  product: ProductSummary;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = getPrimaryProductImage(product);
  const currentPrice = getDisplayPrice(product);
  const defaultOption = getDefaultProductOption(product);
  const compareAtPrice = defaultOption ? getCompareAtPrice(defaultOption) : null;
  const activeOptions = getActiveProductOptions(product);
  const t = useDictionary();

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.45rem] border border-[#fff4e2] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,248,237,0.94))] p-2.5 shadow-[0_20px_44px_rgba(142,79,18,0.12)] backdrop-blur-md hover-premium-shadow sm:rounded-[1.75rem] sm:p-4",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.25rem] border border-white/70 bg-[#ffe6bc] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] sm:rounded-[1.4rem]">
        {primaryImage ? (
          <img
            src={primaryImage.imageUrl}
            alt={primaryImage.altText || product.name}
            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:aspect-[4/3]"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-square w-full items-end bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_34%),linear-gradient(135deg,#ffe5ba,#f3ab4d)] p-3 sm:aspect-[4/3] sm:p-4">
            <span className="rounded-full bg-white/84 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-deep sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
              FreshBitan
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-2.5 sm:p-4">
          <span className="max-w-[66%] truncate rounded-full bg-white/88 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-deep shadow-[0_8px_18px_rgba(142,79,18,0.08)] sm:max-w-[70%] sm:px-3 sm:text-xs sm:tracking-normal">
            {product.category?.name || t.common.seasonalFruit}
          </span>
          {product.isFeatured ? (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_10px_20px_rgba(239,139,30,0.24)] sm:px-3 sm:text-xs sm:tracking-normal">
              {t.common.featured}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="line-clamp-2 min-h-[2.8rem] text-[1.05rem] font-semibold leading-[1.28] text-brand-deep sm:min-h-[3.15rem] sm:text-xl sm:leading-snug">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-3 min-h-[4.3rem] text-[13px] leading-6 text-muted sm:min-h-14 sm:text-sm sm:leading-7">
          {product.shortDescription ||
            product.description ||
            (t.common.cart === "Cart"
              ? "Premium mangoes prepared for trusted orchard-to-home delivery."
              : "প্রিমিয়াম আম, trusted orchard-to-home delivery-এর জন্য প্রস্তুত।")}
        </p>
      </div>

      <div className="mt-4 flex flex-col items-start gap-2 rounded-[1.15rem] border border-[#efe3c8] bg-white/82 px-3 py-2.5 shadow-[0_12px_24px_rgba(142,79,18,0.06)] sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div>
          <p className="text-sm text-muted">{t.common.cart === "Cart" ? "Starting price" : "শুরুর দাম"}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[1.05rem] font-bold text-foreground sm:text-lg">
              {formatCurrency(currentPrice)}
            </span>
            {compareAtPrice ? (
              <span className="hidden text-xs text-muted line-through sm:inline">
                {formatCurrency(compareAtPrice)}
              </span>
            ) : null}
          </div>
        </div>
        <span className="rounded-full bg-[#edf6f0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent sm:px-3 sm:text-xs sm:tracking-normal">
          {defaultOption
            ? getCompactOptionLabel(defaultOption.label)
            : activeOptions.length > 1
              ? (t.common.cart === "Cart" ? "Pack options" : "প্যাক অপশন")
              : product.unit}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:gap-3">
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-w-0 px-3 text-center text-[13px] sm:min-h-11 sm:px-4 sm:text-sm",
          )}
        >
          {t.common.details}
        </Link>
        {activeOptions.length > 1 ? (
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "min-w-0 px-3 text-center text-[13px] sm:min-h-11 sm:px-4 sm:text-sm",
            )}
          >
            {t.common.cart === "Cart" ? "Choose pack" : "প্যাক বাছুন"}
          </Link>
        ) : (
          <AddToCartButton
            product={product}
            size="sm"
            className="min-w-0 px-3 text-[13px] sm:min-h-11 sm:px-4 sm:text-sm"
          />
        )}
      </div>
    </article>
  );
}
