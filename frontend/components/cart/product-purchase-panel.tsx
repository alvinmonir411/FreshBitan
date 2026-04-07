"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { useDictionary, useSiteLocale } from "@/components/layout/locale-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import {
  buildWhatsappLink,
  formatCurrency,
  getActiveProductOptions,
  getCompactOptionLabel,
  getExpandedOptionDetails,
  getCompareAtPrice,
  getDefaultProductOption,
} from "@/lib/utils";
import { CartProductInput } from "@/types/cart";

interface ProductPurchasePanelProps {
  product: CartProductInput;
  whatsappNumber: string;
  whatsappMessage: string;
}

export function ProductPurchasePanel({
  product,
  whatsappNumber,
  whatsappMessage,
}: ProductPurchasePanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const optionChoices = getActiveProductOptions(product);
  const defaultOption = getDefaultProductOption(product);
  const [selectedOptionId, setSelectedOptionId] = useState(defaultOption?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const t = useDictionary();
  const locale = useSiteLocale();

  const selectedOption =
    optionChoices.find((option) => option.id === selectedOptionId) ?? defaultOption;
  const isOutOfStock = !selectedOption || selectedOption.stockQuantity <= 0;
  const maxQuantity = selectedOption?.stockQuantity && selectedOption.stockQuantity > 0
    ? selectedOption.stockQuantity
    : 99;

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-[1.6rem] border border-border bg-white/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {locale === "en" ? "Pack size" : "প্যাক সাইজ"}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              {locale === "en"
                ? "Choose the mango pack or weight you want before adding this product to the cart."
                : "কার্টে যোগ করার আগে আপনার পছন্দের আমের ওজন বা প্যাক সাইজ বেছে নিন।"}
            </p>
          </div>
          {selectedOption ? (
            <div className="text-right">
              <p className="text-lg font-bold text-brand-deep">
                {formatCurrency(selectedOption.discountedPrice ?? selectedOption.price)}
              </p>
              {getCompareAtPrice(selectedOption) ? (
                <p className="text-sm text-muted line-through">
                  {formatCurrency(getCompareAtPrice(selectedOption)!)}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {optionChoices.map((option) => {
            const isSelected = option.id === selectedOption?.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedOptionId(option.id);
                  setQuantity(1);
                }}
                className={
                  isSelected
                    ? "rounded-full border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
                }
              >
                {getCompactOptionLabel(option.label)}
              </button>
            );
          })}
        </div>

        {selectedOption ? (
          <div className="mt-4 rounded-[1.2rem] border border-[#dfe8cb] bg-[#f7faef] px-4 py-3 text-sm leading-7 text-muted">
            <span className="font-semibold text-brand-deep">
              {locale === "en" ? "Pack details:" : "প্যাকের বিস্তারিত:"}
            </span>{" "}
            {getExpandedOptionDetails(selectedOption.label)}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 rounded-[1.6rem] border border-border bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t.common.quantity}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted">
            {locale === "en"
              ? "Set the quantity you need, then continue to the cart or checkout."
              : "প্রয়োজন অনুযায়ী পরিমাণ ঠিক করুন, তারপর কার্ট বা চেকআউটে যান।"}
          </p>
        </div>
        <QuantityStepper value={quantity} max={maxQuantity} onChange={setQuantity} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          fullWidth
          disabled={isOutOfStock}
          onClick={() => selectedOption && addItem(product, selectedOption, quantity)}
        >
          {isOutOfStock ? (locale === "en" ? "Out of stock" : "স্টক শেষ") : locale === "en" ? "Add to cart" : "কার্টে যোগ করুন"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          disabled={isOutOfStock}
          onClick={() => {
            if (!selectedOption) {
              return;
            }

            addItem(product, selectedOption, quantity);
            router.push("/checkout");
          }}
        >
          {locale === "en" ? "Direct checkout" : "সরাসরি চেকআউট"}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/cart"
          className={buttonVariants({ variant: "outline", size: "lg", fullWidth: true })}
        >
          {t.common.viewCart}
        </Link>
        <a
          href={buildWhatsappLink(
            whatsappNumber,
            `${whatsappMessage} Product: ${product.name}${selectedOption ? ` (${selectedOption.label})` : ""}`,
          )}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "whatsapp", size: "lg", fullWidth: true })}
        >
          {locale === "en" ? "WhatsApp inquiry" : "WhatsApp ইনকোয়ারি"}
        </a>
      </div>
    </div>
  );
}
