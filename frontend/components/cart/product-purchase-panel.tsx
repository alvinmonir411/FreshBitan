"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { buildWhatsappLink } from "@/lib/utils";
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
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stockQuantity <= 0;
  const maxQuantity = product.stockQuantity > 0 ? product.stockQuantity : 99;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.6rem] border border-border bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Quantity
          </p>
          <p className="mt-2 text-sm leading-7 text-muted">
            প্রয়োজন অনুযায়ী quantity ঠিক করুন, তারপর cart বা checkout-এ যান।
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
          onClick={() => addItem(product, quantity)}
        >
          {isOutOfStock ? "স্টক শেষ" : "কার্টে যোগ করুন"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          disabled={isOutOfStock}
          onClick={() => {
            addItem(product, quantity);
            router.push("/checkout");
          }}
        >
          সরাসরি checkout
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/cart"
          className={buttonVariants({ variant: "outline", size: "lg", fullWidth: true })}
        >
          কার্ট দেখুন
        </Link>
        <a
          href={buildWhatsappLink(
            whatsappNumber,
            `${whatsappMessage} Product: ${product.name}`,
          )}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "whatsapp", size: "lg", fullWidth: true })}
        >
          WhatsApp inquiry
        </a>
      </div>
    </div>
  );
}
