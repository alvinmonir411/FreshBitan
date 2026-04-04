/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { buttonVariants } from "@/components/ui/button";
import { ProductSummary } from "@/types/api";
import { cn, formatCurrency, getDisplayPrice, getPrimaryProductImage } from "@/lib/utils";

interface ProductCardProps {
  product: ProductSummary;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = getPrimaryProductImage(product);
  const currentPrice = getDisplayPrice(product);

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
            {product.category?.name || "Seasonal Fruit"}
          </span>
          {product.isFeatured ? (
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-semibold text-brand-deep">{product.name}</h3>
        <p className="mt-2 min-h-14 text-sm leading-7 text-muted">
          {product.shortDescription ||
            product.description ||
            "Season-picked fruit with premium presentation and careful delivery support."}
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Starting price</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(currentPrice)}
            </span>
            {product.discountedPrice ? (
              <span className="text-sm text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
          </div>
        </div>
        <span className="rounded-full bg-[#edf6f0] px-3 py-1 text-xs font-semibold text-accent">
          {product.unit}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href={`/products/${product.slug}`}
          className={buttonVariants({ variant: "outline", size: "md" })}
        >
          বিস্তারিত
        </Link>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
