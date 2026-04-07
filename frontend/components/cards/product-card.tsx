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
        "group rounded-[1.75rem] border border-white/60 glass-card p-4 hover-premium-shadow",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.4rem] bg-[#ffe6bc]">
        {primaryImage ? (
          <img
            src={primaryImage.imageUrl}
            alt={primaryImage.altText || product.name}
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-end bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_30%),linear-gradient(135deg,#ffe5ba,#f3ab4d)] p-4">
            <span className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-deep">
              FreshBitan
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-brand-deep">
            {product.category?.name || t.common.seasonalFruit}
          </span>
          {product.isFeatured ? (
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              {t.common.featured}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-semibold text-brand-deep">{product.name}</h3>
        <p className="mt-2 min-h-14 text-sm leading-7 text-muted">
          {product.shortDescription ||
            product.description ||
            (t.common.cart === "Cart"
              ? "Premium mangoes prepared for trusted orchard-to-home delivery."
              : "প্রিমিয়াম আম, trusted orchard-to-home delivery-এর জন্য প্রস্তুত।")}
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{t.common.cart === "Cart" ? "Starting price" : "শুরুর দাম"}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(currentPrice)}
            </span>
            {compareAtPrice ? (
              <span className="text-sm text-muted line-through">
                {formatCurrency(compareAtPrice)}
              </span>
            ) : null}
          </div>
        </div>
        <span className="rounded-full bg-[#edf6f0] px-3 py-1 text-xs font-semibold text-accent">
          {defaultOption
            ? getCompactOptionLabel(defaultOption.label)
            : activeOptions.length > 1
              ? (t.common.cart === "Cart" ? "Pack options" : "প্যাক অপশন")
              : product.unit}
        </span>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "md" }),
            "min-w-0 flex-1 whitespace-nowrap px-4 text-sm sm:text-sm",
          )}
        >
          {t.common.details}
        </Link>
        {activeOptions.length > 1 ? (
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "min-w-0 flex-1 whitespace-nowrap px-4 text-sm sm:text-sm",
            )}
          >
            {t.common.cart === "Cart" ? "Choose pack" : "প্যাক বাছুন"}
          </Link>
        ) : (
          <AddToCartButton
            product={product}
            className="min-w-0 flex-1 whitespace-nowrap px-4 text-sm sm:text-sm"
          />
        )}
      </div>
    </article>
  );
}
