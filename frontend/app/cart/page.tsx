import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review your FreshBitan shopping cart, update quantities, and continue to checkout.",
};

export default async function CartPage() {
  const siteContent = await getSiteContent();

  return <CartPageContent siteContent={siteContent} />;
}
