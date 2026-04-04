import { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryCardProps {
  items: CartItem[];
  subtotal: number;
  deliveryCharge?: number;
  total: number;
  title: string;
  description: string;
  footerNote?: string;
  children?: React.ReactNode;
}

export function OrderSummaryCard({
  items,
  subtotal,
  deliveryCharge,
  total,
  title,
  description,
  footerNote,
  children,
}: OrderSummaryCardProps) {
  return (
    <aside className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_20px_50px_rgba(142,79,18,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        Order Summary
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-brand-deep">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>

      <div className="mt-6 space-y-4 rounded-[1.6rem] border border-border bg-white/75 p-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-start justify-between gap-4 border-b border-border/70 pb-4 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="font-semibold text-brand-deep">{item.name}</p>
              <p className="mt-1 text-sm text-muted">
                {item.quantity} x {item.unit}
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency((item.discountedPrice ?? item.price) * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 text-sm text-foreground">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery Charge</span>
          <span className="font-semibold">
            {deliveryCharge === undefined
              ? "Checkout-এ নির্ধারণ হবে"
              : formatCurrency(deliveryCharge)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-base">
          <span className="font-semibold text-brand-deep">Total</span>
          <span className="font-bold text-brand-deep">{formatCurrency(total)}</span>
        </div>
      </div>

      {footerNote ? (
        <p className="mt-4 rounded-[1.4rem] bg-[#fff4df] px-4 py-3 text-sm leading-6 text-[#7a541f]">
          {footerNote}
        </p>
      ) : null}

      {children ? <div className="mt-6 grid gap-3">{children}</div> : null}
    </aside>
  );
}
